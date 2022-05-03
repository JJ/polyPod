import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class DataImportingStatusAnalysis extends ReportAnalysis {
    async analyze({ dataAccount }) {
        dataAccount.reports[analysisKeys.importersData] =
            dataAccount.importingResults.map(
                (importerResult) => importerResult.reportJsonData
            );
    }
}