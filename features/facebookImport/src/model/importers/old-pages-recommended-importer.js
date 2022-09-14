import DirectKeyDataImporter from "./direct-key-data-importer.js";
import { OLD_PAGES_DIRECTORY } from "./paths.js";

export const RECOMMENDED_PAGES_FILE_PATH = `${OLD_PAGES_DIRECTORY}/pages_you've_recommended.json`;
export const RECOMMENDED_PAGES_DATA_KEY = "recommended_pages_v2";
export const RECOMMENDED_PAGES_STORAGE_KEY = "recommendedPages";

export default class OldRecommendedPagesImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            RECOMMENDED_PAGES_FILE_PATH,
            RECOMMENDED_PAGES_DATA_KEY,
            RECOMMENDED_PAGES_STORAGE_KEY
        );
    }
}
