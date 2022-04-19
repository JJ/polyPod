import React from "react";

import i18n from "../../i18n.js";
import Story from "./story.jsx";
import {
    ActivitiesMiniStorySummary,
    ActivitiesMiniStoryDetails,
} from "../../components/activitiesMiniStory/activitiesMiniStory.jsx";
import analysisKeys from "../../model/analysisKeys";

class ActivitiesMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.totalEvents];
    }

    get title() {
        return i18n.t("activitiesMiniStory:title");
    }

    renderSummary() {
        return (
            <ActivitiesMiniStorySummary
                totalEvents={this.analyses[analysisKeys.totalEvents]}
            />
        );
    }

    renderDetails() {
        return (
            <ActivitiesMiniStoryDetails
                totalEvents={this.analyses[analysisKeys.totalEvents]}
            />
        );
    }
}

export default ActivitiesMinistory;