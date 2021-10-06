import { readJSONDataArray } from "./utils/importer-util.js";

export default class DirectKeyDataImporter {
    constructor(dataFileName, dataKey, dataStorageKey) {
        this._dataFileName = dataFileName;
        this._dataKey = dataKey;
        this._dataStorageKey = dataStorageKey;
    }

    async import({ id, zipFile }, facebookAccount) {
        facebookAccount[this._dataStorageKey] = await readJSONDataArray(
            this._dataFileName,
            this._dataKey,
            zipFile,
            id
        );
        facebookAccount.addImportedFileName(this._dataFileName);
    }
}