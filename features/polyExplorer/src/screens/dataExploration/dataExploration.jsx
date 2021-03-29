import React, { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import DataTypeBubbles from "../../components/dataViz/dataTypeBubbles.jsx";
import DataTypeBubbleCategory from "../../components/dataViz/dataTypeBubbleCategory.jsx";
import DataTypeBubbleCorrelation from "../../components/dataViz/dataTypeBubbleCorrelation.jsx";
import PurposeChart from "../../components/dataViz/purposeChart.jsx";
import CompanyBubbles from "../../components/dataViz/companyBubbles.jsx";
import JurisdictionTree from "../../components/dataViz/jurisdictionTree.jsx";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import DataSharingLegend from "../../components/dataSharingLegend/dataSharingLegend.jsx";
import PurposeInfoPopup from "../../components/purposeInfoPopup/purposeInfoPopup.jsx";
import CompanyIndustryList from "../../components/companyIndustryList/companyIndustryList.jsx";

import global from "../../data/global.json";
import highlights from "../../data/highlights.js";

import "swiper/swiper-bundle.min.css";
import "./dataExploration.css";
import JurisdictionLegend from "../../components/jurisdictionLegend/jurisdictionLegend.jsx";

const DataExplorationScreen = ({
    company,
    startSection,
    startCategory = null,
    openMain,
    openDataTypesInfo,
    openCategoryInfo,
    openCorrelationInfo,
    openPurposeInfo,
    openCompaniesInfo,
    openJurisdictionInfo,
    maxCompanies,
    dataRecipients,
    onOpenRegionInfo,
}) => {
    //Methods
    const getCategories = () =>
        Object.keys(highlights[company.name]?.dataTypeCategories || {});

    const getTotalTypesShared = () => {
        let total = 0;
        company.dataTypesShared.forEach((e) => {
            total += e.count;
        });
        return total;
    };

    const companyIndustryMap = useMemo(() => {
        const map = {};
        for (let company of dataRecipients) {
            const industry =
                company.industryCategory?.name[i18n.language] ||
                i18n.t("common:category.undisclosed");
            if (!map[industry]) map[industry] = [];
            map[industry].push(company);
        }
        return map;
    }, dataRecipients);

    const getJurisdictionTreeFormat = () => {
        const jurisdictionTreeFormatData = { name: "World", children: [] };
        dataRecipients.forEach((e) => {
            let jurisdiction = jurisdictionTreeFormatData.children.find(
                (j) => j.name === e.jurisdiction
            );
            if (jurisdiction !== undefined) {
                let country = jurisdiction.children.find(
                    (c) => c.name === e.location.countryCode
                );
                if (country !== undefined) country.value++;
                else
                    jurisdiction.children.push({
                        name: e.location.countryCode,
                        value: 1,
                        category: e.jurisdiction,
                    });
            } else {
                jurisdictionTreeFormatData.children.push({
                    name: e.jurisdiction,
                    children: [
                        {
                            name: e.location.countryCode,
                            value: 1,
                            category: e.jurisdiction,
                        },
                    ],
                });
            }
        });
        return jurisdictionTreeFormatData;
    };

    const getScreens = () => {
        const screens = [
            "dataTypes",
            "dataTypesUnderText",
            "dataTypesCategory",
        ];
        categories.forEach((c) => {
            screens.push(`dataTypesCategory_${c}`);
        });
        screens.push("dataTypesUnderTextNoNumbers");
        screens.push("dataTypesCorrelation");
        screens.push("purposes");
        screens.push("companies");
        screens.push("companiesExplanation");
        screens.push("companiesIndustries");
        screens.push("companiesIndustryHighlight");
        screens.push("companiesCompanyHighlight");
        screens.push("companiesList");
        screens.push("jurisdictions");
        return screens;
    };

    const getStartIndex = () => {
        if (startSection === "dataTypesCategory" && startCategory)
            return screens.indexOf(`dataTypesCategory_${startCategory}`);
        return screens.indexOf(startSection);
    };

    const getHighestValueObject = () => {
        let highest = { count: 0 };
        company.dataTypesShared.forEach((e) =>
            e.count > highest.count ? (highest = e) : null
        );
        return highest;
    };

    const goToSlide = (slide) => {
        swiper.slideTo(slide, 0);
        setActiveIndex(slide);
    };

    //Navigation
    const categories = getCategories();
    const screens = getScreens();

    //State
    const [swiper, setSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(getStartIndex());
    const [purposePopupContent, setPurposePopupContent] = useState(null);

    //Constants
    const activeScreen = screens[activeIndex];
    const highestValueObject = getHighestValueObject();
    const jurisdictionTreeFormatData = getJurisdictionTreeFormat();

    const progressBar = (
        <div className="progress-bar">
            <div
                className={`progress-bar-part dataTypes ${
                    activeScreen.startsWith("dataTypes") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("dataTypes"))}
            ></div>
            <div
                className={`progress-bar-part purposes ${
                    activeScreen == "purposes" ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("purposes"))}
            ></div>
            <div
                className={`progress-bar-part companiesShared ${
                    activeScreen.startsWith("companies") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("companies"))}
            ></div>
            <div
                className={`progress-bar-part jurisdictions ${
                    activeScreen.startsWith("jurisdictions") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("jurisdictions"))}
            ></div>
        </div>
    );

    function makeSwiperContentScrollable(element) {
        let startScroll, touchStart;

        element.addEventListener(
            "touchstart",
            function (event) {
                startScroll = element.scrollTop;
                touchStart = event.targetTouches[0].pageY;
            },
            true
        );

        element.addEventListener(
            "touchmove",
            function (event) {
                const scrollDiff = element.scrollHeight - element.clientHeight;
                if (scrollDiff <= 0) return;

                const touchCurrent = event.targetTouches[0].pageY;
                const touchesDiff = touchCurrent - touchStart;
                const topToBottom = touchesDiff < 0 && startScroll === 0;
                const atEnd = Math.abs(startScroll - scrollDiff) < 1;
                const bottomToTop = touchesDiff > 0 && atEnd;
                const middle = startScroll > 0 && !atEnd;
                if (topToBottom || bottomToTop || middle)
                    event.stopPropagation();
            },
            true
        );
    }

    const getStaticContent = () => {
        const filler = <div className="filler"></div>;
        if (activeScreen === "dataTypes")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight-data-type">
                            {company.dataTypesShared.length}{" "}
                            {i18n.t("common:sharing.dataTypes")}
                        </span>
                    </h1>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="360"
                        height="360"
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openDataTypesInfo();
                        }}
                    />
                    {filler}
                </div>
            );
        else if (
            activeScreen === "dataTypesUnderText" ||
            activeScreen === "dataTypesCategory"
        )
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight-data-type">
                            {company.dataTypesShared.length}{" "}
                            {i18n.t("common:sharing.dataTypes")}
                        </span>
                    </h1>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="360"
                        height="360"
                        opacity={0.2}
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <div className="data-sharing-legend-fill"></div>
                    {filler}
                </div>
            );
        else if (activeScreen.startsWith("dataTypesCategory"))
            return (
                <div className="static-content">
                    <h1></h1>
                    <DataTypeBubbleCategory
                        data={company.dataTypesShared}
                        defaultColor="#FB8A89"
                        category={categories[activeIndex - 3]}
                        textColor="#0f1938"
                        width="360"
                        height="360"
                        highlightedType={
                            highlights[company.name].dataTypeCategories[
                                activeScreen.split("_")[1]
                            ].category
                        }
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCategoryInfo(activeScreen.split("_")[1]);
                        }}
                    />
                    {filler}
                </div>
            );
        else if (activeScreen === "dataTypesUnderTextNoNumbers")
            return (
                <div className="static-content">
                    <h2 className="highlight-data-type">
                        {i18n.t(
                            "dataExplorationScreen:dataTypes.heading.correlations"
                        )}
                    </h2>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="360"
                        height="360"
                        opacity={0.2}
                        showValues={false}
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <div className="data-sharing-legend-fill"></div>
                </div>
            );
        else if (activeScreen === "dataTypesCorrelation")
            return (
                <div className="static-content">
                    <h2 className="highlight-data-type">
                        {i18n.t(
                            "dataExplorationScreen:dataTypes.heading.correlations"
                        )}
                    </h2>
                    <DataTypeBubbleCorrelation
                        data={company.dataTypesShared}
                        correlationColor="#FB8A89"
                        typeBundle={
                            highlights[company.name]?.dataTypeCorrelation
                                .types || []
                        }
                        width="360"
                        height="360"
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCorrelationInfo();
                        }}
                    />
                </div>
            );
        else if (activeScreen === "purposes")
            return <div className="static-content">{filler}</div>;
        else if (activeScreen === "companies")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.prefix.companies")}{" "}
                        <span className="highlight-companies">
                            {dataRecipients.length}{" "}
                            {i18n.t("common:sharing.companies")}
                        </span>
                    </h1>
                    <CompanyBubbles
                        view="flat"
                        companyIndustryMap={companyIndustryMap}
                        width="360"
                        height="360"
                        bubbleColor="#7EE8A2"
                        maxCompanies={maxCompanies}
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCompaniesInfo();
                        }}
                    />
                </div>
            );
        else if (activeScreen === "companiesExplanation")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.prefix.companies")}{" "}
                        <span className="highlight-companies">
                            {dataRecipients.length}{" "}
                            {i18n.t("common:sharing.companies")}
                        </span>
                    </h1>
                    <CompanyBubbles
                        view="flat"
                        companyIndustryMap={companyIndustryMap}
                        width="360"
                        height="360"
                        opacity={0.1}
                        bubbleColor="#7EE8A2"
                        maxCompanies={maxCompanies}
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <div className="data-sharing-legend-fill"></div>
                    {filler}
                </div>
            );
        else if (
            [
                "companiesIndustries",
                "companiesIndustryHighlight",
                "companiesCompanyHighlight",
            ].includes(activeScreen)
        )
            return (
                <div className="static-content">
                    <h2 className="highlight-companies">
                        {i18n.t(
                            "dataExplorationScreen:companies.heading.industries"
                        )}
                    </h2>
                    <CompanyBubbles
                        view={
                            {
                                companiesIndustries: "allIndustries",
                                companiesIndustryHighlight: "industryHighlight",
                                companiesCompanyHighlight: "companyHighlight",
                            }[activeScreen]
                        }
                        companyIndustryMap={companyIndustryMap}
                        width="360"
                        height="360"
                        bubbleColor="#7EE8A2"
                        maxCompanies={maxCompanies}
                        highlight={highlights[company.name]?.dataRecipient}
                    />
                    <p className="bubble-source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCompaniesInfo();
                        }}
                    />
                </div>
            );
        else if (activeScreen === "companiesList")
            return <div className="static-content">{filler}</div>;
        else if (activeScreen === "construction")
            return (
                <div className="static-content">
                    <div className="construction-container">
                        <p>
                            {i18n.t("dataExplorationScreen:construction.text")}
                        </p>
                        <img src="./images/construction.gif" />
                    </div>
                </div>
            );
        else if (activeScreen === "jurisdictions")
            return <div className="static-content"></div>;
    };

    function handleSwipableContentClick(event) {
        // Workaround for ensuring data sharing legend (which is covered by
        // swipable content) is clickable. There isprobably a more elegant way.
        const sharingLegend = document.querySelector(".data-sharing-legend");
        if (!sharingLegend) return;
        const bounds = sharingLegend.getBoundingClientRect();
        if (
            event.clientX > bounds.left &&
            event.clientX < bounds.right &&
            event.clientY > bounds.top &&
            event.clientY < bounds.bottom
        )
            sharingLegend.click();
    }

    useEffect(() => {
        const scrollableElements = document.querySelectorAll(
            ".purpose-content .bars, .companies-by-industry"
        );
        for (let element of scrollableElements)
            makeSwiperContentScrollable(element);
    });

    return (
        <Screen className="data-exploration">
            <div className="company-short-info-container">
                <CompanyShortInfo company={company} />
            </div>
            {progressBar}
            <div className="exploration-content">
                {getStaticContent()}
                <div
                    className="swipable-content"
                    onClick={handleSwipableContentClick}
                >
                    <Swiper
                        onSwiper={setSwiper}
                        direction="vertical"
                        initialSlide={activeIndex}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.activeIndex)
                        }
                    >
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:dataTypes.text.intro",
                                    {
                                        name: company.name,
                                        sharingCount: getTotalTypesShared(),
                                        mostSharedType:
                                            highestValueObject.Translation_DE,
                                        mostSharedCount:
                                            highestValueObject.count,
                                    }
                                )}
                            </p>
                        </SwiperSlide>
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:dataTypes.text.grouping"
                                )}
                            </p>
                        </SwiperSlide>
                        {categories.map((group, index) => (
                            <SwiperSlide
                                key={index}
                                onClick={() => swiper.slideNext()}
                            >
                                <h2>
                                    {global.polypoly_parent_categories[group]?.[
                                        `Translation_${i18n.language.toUpperCase()}`
                                    ] ||
                                        i18n.t(
                                            "dataExplorationScreen:dataTypes.without-category"
                                        )}
                                </h2>
                            </SwiperSlide>
                        ))}
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:dataTypes.text.correlations"
                                )}
                            </p>
                        </SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide>
                            <div className="purpose-content">
                                <h1>
                                    {i18n.t("common:sharing.prefix.purposes")}{" "}
                                    <span className="highlight-purpose">
                                        {company.dataSharingPurposes.length}{" "}
                                        {i18n.t("common:sharing.purposes")}
                                    </span>
                                </h1>
                                <PurposeChart
                                    purposes={company.dataSharingPurposes}
                                    openPopup={setPurposePopupContent}
                                    openPurposeInfo={openPurposeInfo}
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:companies.text.intro"
                                )}
                            </p>
                        </SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide>
                            <div className="companies-list-content">
                                <h2>
                                    <span className="highlight-companies">
                                        {i18n.t(
                                            "dataExplorationScreen:companies.heading.list"
                                        )}
                                    </span>
                                </h2>
                                <p>
                                    {i18n.t(
                                        "dataExplorationScreen:companies.text.list",
                                        { name: company.name }
                                    )}
                                </p>
                                <CompanyIndustryList
                                    companyIndustryMap={companyIndustryMap}
                                    ecoItems={dataRecipients.length > 100}
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="jurisdiction-tree-container">
                                <h1>
                                    {i18n.t(
                                        "common:sharing.prefix.jurisdictions"
                                    )}{" "}
                                    {jurisdictionTreeFormatData.children.length}{" "}
                                    {i18n.t("common:sharing.jurisdictions")}
                                </h1>

                                <JurisdictionTree
                                    data={getJurisdictionTreeFormat()}
                                />
                                <JurisdictionLegend
                                    onOpenRegionInfo={onOpenRegionInfo}
                                />
                                <DataSharingLegend
                                    onOpenRegionInfo={() => {
                                        openJurisdictionInfo();
                                    }}
                                />
                                <button
                                    className="explore-other"
                                    onClick={openMain}
                                >
                                    {i18n.t(
                                        "dataExplorationScreen:explore.other"
                                    )}
                                </button>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            <button
                className={
                    "down-button" +
                    (activeIndex === screens.length - 1
                        ? " down-button-hidden"
                        : "")
                }
                onClick={() => swiper.slideNext()}
            ></button>
            {purposePopupContent ? (
                <PurposeInfoPopup
                    purpose={purposePopupContent}
                    onClose={() => setPurposePopupContent(null)}
                />
            ) : null}
        </Screen>
    );
};

export default DataExplorationScreen;
