import MultipleFilesImporter from "./multiple-files-importer";
import { removeEntryPrefix } from "./utils/importer-util";

export default class PostsImporter extends MultipleFilesImporter {
    _isTargetPostFile(entryName) {
        const formattedEntryName = removeEntryPrefix(entryName);
        return /posts\/your_posts_[1-9][0-9]?.json$/.test(formattedEntryName);
    }

    _importRawDataResults(facebookAccount, dataResults) {
        dataResults.forEach((rawPosts) => {
            const postsWithTimestamp = rawPosts.map((postData) => {
                return { timestamp: postData.timestamp };
            });
            facebookAccount.addPosts(postsWithTimestamp);
        });
    }
}