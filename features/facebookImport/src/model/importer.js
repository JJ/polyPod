import OffFacebookEventsImporter from "./importers/off-facebook-events-importer.js";
import AdInterestsImporter from "./importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "./importers/connected-advertisers-importer.js";
import ConnectedAdvertisersAllTypesImporter from "./importers/connected-advertisers-all-types-importer.js";
import InteractedWithAdvertisersImporter from "./importers/interacted-with-advertisers-importer.js";
import FriendsImporter from "./importers/friends-importer.js";
import FollowedPagesImporter from "./importers/pages-followed-importer.js";
import OldFollowedPagesImporter from "./importers/old-pages-followed-importer.js";
import ReceivedFriendRequestsImporter from "./importers/friend-requests-received-importer.js";
import LikedPagesImporter from "./importers/pages-liked-importer.js";
import OldLikedPagesImporter from "./importers/old-pages-liked-importer.js";
import RecommendedPagesImporter from "./importers/pages-recommended-importer.js";
import OldRecommendedPagesImporter from "./importers/old-pages-recommended-importer.js";
import SearchesImporter from "./importers/searches-importer.js";
import UnfollowedPagesImporter from "./importers/pages-unfollowed-importer.js";
import OldUnfollowedPagesImporter from "./importers/old-pages-unfollowed-importer.js";
import MessagesImporter from "./importers/messages-importer.js";
import AdminRecordsImporter from "./importers/admin-records-importer.js";
import AccountSessionActivitiesImporter from "./importers/account-session-activities-importer.js";
import PersonalDataImporter from "./importers/personal-data-importer.js";
import LanguageAndLocaleImporter from "./importers/language-and-locale-importer.js";
import RecentlyViewedAdsImporter from "./importers/recently-viewed-ads-importer.js";
import CommentsImporter from "./importers/comments-importer.js";
import PostReactionsImporter from "./importers/post-reactions-importer.js";
import PostsImporter from "./importers/posts-importer.js";

export const dataImporters = [
    AdInterestsImporter,
    ConnectedAdvertisersImporter,
    ConnectedAdvertisersAllTypesImporter,
    OffFacebookEventsImporter,
    InteractedWithAdvertisersImporter,
    FriendsImporter,
    FollowedPagesImporter,
    OldFollowedPagesImporter,
    LikedPagesImporter,
    OldLikedPagesImporter,
    ReceivedFriendRequestsImporter,
    RecommendedPagesImporter,
    OldRecommendedPagesImporter,
    SearchesImporter,
    UnfollowedPagesImporter,
    OldUnfollowedPagesImporter,
    MessagesImporter,
    AdminRecordsImporter,
    AccountSessionActivitiesImporter,
    PersonalDataImporter,
    LanguageAndLocaleImporter,
    RecentlyViewedAdsImporter,
    CommentsImporter,
    PostReactionsImporter,
    PostsImporter,
];

export const NUMBER_OF_IMPORTERS = dataImporters.length;
