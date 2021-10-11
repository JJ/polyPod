import RootAnalysis from "../analyses/ministories/root-analysis";
import RelatedAccount from "../entities/related-account";
import RelatedPost from "../entities/related-post";
import {
    extractNameFromAdDescription,
    localeForCategoyName,
} from "./utils/ads-locale";
import { readJSONDataArray } from "./utils/importer-util";
import { extractAccountDataFromUrl } from "./utils/url-processing";

/**
 * Extract ad views from the export.
 *
 * To find the ad views we look for an entry with the attribute name
 * matching a known name. For example:
 * {
 *   name: "Ads"
 *   entries: [ ... ]
 * }
 *
 * An entry should have this format:
 * {
 *    "timestamp": 1630875618,
 *    "data": {
 *      "name": "Ad by Company X",
 *       "uri": <url>
 *    }
 * }
 *
 * The handling of the name is language dependent.
 * Two types of URLs are currently supported:
 *   - https://www.facebook.com/CompanyX/posts/57352627288888
 *   - https://www.facebook.com/permalink.php?story_fbid=1111222334&id=99988877766
 *
 * From this we extract a model consisting in an account that has ads that have views.
 */
export default class RecentlyViewedAdsImporter extends RootAnalysis {
    constructor() {
        super();
        this._accountsByUrl = new Map();
    }

    async _readRecentlyViewedData(id, zipFile) {
        return readJSONDataArray(
            "your_interactions_on_facebook/recently_viewed.json",
            "recently_viewed",
            zipFile,
            id
        );
    }

    _ensureAd(adViewData, relatedAccount) {
        const adUrl = adViewData.data.uri;
        const post = relatedAccount.postWithUrl(adUrl);
        if (post) {
            post.markAsAd();
            return post;
        }
        const newAd = new RelatedPost({ url: adUrl });
        newAd.markAsAd();
        relatedAccount.addRelatedPost(newAd);
        return newAd;
    }

    _ensureRelatedAccount(adData, currentLocale) {
        if (!adData?.uri) {
            return;
        }
        const accountData = extractAccountDataFromUrl(adData.uri);
        if (!accountData) {
            return;
        }

        if (this._accountsByUrl.has(accountData.url)) {
            return this._accountsByUrl.get(accountData.url);
        }
        const relatedAccount = new RelatedAccount(accountData);
        if (adData?.name) {
            relatedAccount.displayName = extractNameFromAdDescription(
                adData.name,
                currentLocale
            );
        }
        this._accountsByUrl.set(relatedAccount.url, relatedAccount);
        return relatedAccount;
    }

    _extractViewedAds(adsViewsData, currentLocale) {
        adsViewsData.entries.forEach((adViewData) => {
            const relatedAccount = this._ensureRelatedAccount(
                adViewData.data,
                currentLocale
            );
            if (!relatedAccount) {
                return;
            }
            const ad = this._ensureAd(
                adViewData,
                relatedAccount,
                currentLocale
            );
            if (adViewData.timestamp) {
                ad.addViewTimestamp(adViewData.timestamp);
            }
        });
    }

    async import({ id, zipFile }, facebookAccount) {
        const rawData = await this._readRecentlyViewedData(id, zipFile);
        const adsViewsData = rawData.find(
            (eachCategory) =>
                localeForCategoyName(eachCategory.name) !== undefined
        );

        if (adsViewsData) {
            const currentLocale = localeForCategoyName(adsViewsData.name);
            this._extractViewedAds(adsViewsData, currentLocale);

            facebookAccount.addRelatedAccounts(this._accountsByUrl.values());
        }
    }
}