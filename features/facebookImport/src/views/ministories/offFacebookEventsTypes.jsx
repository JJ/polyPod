import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys.js";
import ReportStory from "./reportStory.jsx";

class OffFacebookEventsTypesReport extends ReportStory {
    constructor(props) {
        super(props);
        this._neededReports = [analysisKeys.offFacebookEventTypes];
    }

    get title() {
        return "Off-Facebook Event Types";
    }

    render() {
        return (
            <BasicList
                title="Types of activities done off-Facebook!"
                items={this.reports[analysisKeys.offFacebookEventTypes]}
            />
        );
    }
}

export default OffFacebookEventsTypesReport;
