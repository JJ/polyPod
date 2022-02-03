import React, { useState } from "react";

import MatrixBubblesChart from "./MatrixBubblesChart.jsx";
import SourceInfoButton from "../sourceInfoButton/sourceInfoButton.jsx";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";
import {
    createDataTypesTabs,
    createDataTypesSharedCombined,
} from "../../screens/stories/story-utils.js";
import i18n from "../../i18n.js";

const DataTypes = ({ entities, i18nHeader }) => {
    const bubbleColor = "#FB8A89";
    const transparentBubble = "#ffffff00";
    const bubbleStroke = "none";
    const bubbleTextColor = "#0f1938";
    const dataTypesSharedCombined = createDataTypesSharedCombined(entities);

    const dataTypes = createDataTypesTabs(
        entities,
        i18nHeader,
        dataTypesSharedCombined
    );

    const [selectedDataTypeBubble, setSelectedDataTypeBubble] = useState(
        dataTypesSharedCombined[0].category
    );

    const handleBubbleClick = (_, node) => {
        setSelectedDataTypeBubble(node.data.category);
    };

    const showLabel = (bubble) =>
        selectedDataTypeBubble === bubble.data.category
            ? bubble.data.category
            : null;

    return (
        <Tabs>
            {dataTypes.map((dataType, i) => {
                return (
                    <Tab id={dataType.id} label={dataType.label} key={i}>
                        <div className="data-types-legend">
                            <div
                                className="bubble-legend"
                                style={{
                                    backgroundColor: bubbleColor,
                                }}
                            ></div>
                            <p>
                                {i18n.t("clusterStoryCommon:data.types.legend")}
                            </p>
                        </div>
                        {dataType.id !== "by-types" ? (
                            <>
                                <MatrixBubblesChart
                                    data={dataType.data}
                                    bubbleColor={(d) =>
                                        d.data.color
                                            ? bubbleColor
                                            : transparentBubble
                                    }
                                    textColor={bubbleColor}
                                    strokeColor={bubbleStroke}
                                />
                                <SourceInfoButton
                                    infoScreenRoute={dataType.route}
                                    source={i18n.t("common:source.polyPedia")}
                                />
                            </>
                        ) : (
                            <>
                                <div className="by-types-bubble-chart">
                                    <PolyChart
                                        type="bubble-cluster"
                                        data={dataType.data[0].bubbles}
                                        width={dataType.data[0].width}
                                        height={dataType.data[0].height}
                                        bubbleColor={bubbleColor}
                                        text={(d) =>
                                            d.data.category ===
                                            selectedDataTypeBubble
                                                ? d.data.value
                                                : ""
                                        }
                                        textColor={bubbleTextColor}
                                        strokeColor={bubbleStroke}
                                        onBubbleClick={handleBubbleClick}
                                        label={showLabel}
                                    />
                                    <h4>{dataType.data[0].title}</h4>
                                </div>
                                <SourceInfoButton
                                    infoScreenRoute={dataType.route}
                                    source={i18n.t("common:source.polyPedia")}
                                />
                            </>
                        )}
                    </Tab>
                );
            })}
        </Tabs>
    );
};

export default DataTypes;