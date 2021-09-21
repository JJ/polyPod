import { IMPORT_WARNING } from "../importer-status";
import { readJSONDataArray } from "../importer-util";

/**
 * Attempt to extract the language set by the user in the profile.
 *
 * Not the nicest code, as there is no metadata alowing use to identify
 * the language selected by the user. Assume the language data is an array
 * of entries having the following format:
 *
 * {
 *   "name": "Language Settings",
 *   "description": "Your preferred language settings",
 *   "children": [
 *   {
 *      "name": "Selected Language",
 *      "description": "The language you've chosen for your Facebook experience",
 *      "entries": [
 *         {
 *           "data": {
 *             "value": "en_US"
 *           }
 *         }
 *       ]
 *    }
 *   ]
 * },
 *
 * We take the first entry from the array that matches the above format.
 * In all the current exports that we saw the first entry was the language set by the user.
 * In case it is not, the "name", and "description" attributes still allow us to infer the language.
 *
 * @class
 */
export default class LanguageAndLocaleImporter {
    async readLanguageData(id, zipFile) {
        return await readJSONDataArray(
            "preferences/language_and_locale.json",
            "language_and_locale_v2",
            zipFile,
            id
        );
    }

    extractPreferredLanguge(languageData) {
        const languageEntry = languageData.find((entry) => {
            if (!entry.children || !entry.children.length) return;
            const childEntry = entry.children[0];
            return (
                childEntry.entries.length === 1 &&
                childEntry.entries[0].data?.value !== undefined
            );
        });
        if (!languageEntry) return;
        const childEntry = languageEntry.children[0].entries[0];
        return {
            name: languageEntry.children[0].name,
            code: childEntry.data.value,
        };
    }

    async import({ id, zipFile }, facebookAccount) {
        const languageData = await this.readLanguageData(id, zipFile);
        facebookAccount.preferredLanguage =
            this.extractPreferredLanguge(languageData);

        if (!facebookAccount.preferredLanguage) {
            // TODO: Refactor how warnings are created within the importer.
            return {
                status: IMPORT_WARNING,
                importerClass: this.constructor.name,
                message: "Could not extract preferredLanguage",
            };
        }
    }
}