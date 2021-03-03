import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import DataSharingGauge from "./dataSharingGauge.jsx";
import "./featuredCompany.css";

const DataSharingButton = ({
    sharingType,
    count,
    max,
    average,
    showLegend,
    onOpenDetails,
}) => (
    <button
        onClick={onOpenDetails}
        className={`data-sharing-button ${sharingType}-shared`}
    >
        <h1>{i18n.t(`common:sharing.prefix.${sharingType}`)}</h1>
        <h2>
            {count} {i18n.t(`common:sharing.${sharingType}`)}
        </h2>
        <DataSharingGauge
            sharingType={sharingType}
            count={count}
            max={max}
            average={average}
            showLegend={showLegend}
        />
    </button>
);

const FeaturedCompany = ({
    company,
    maxValues,
    averageValues,
    onShowScreenChange,
}) => (
    <div className="featured-company-card">
        <div className="short-info-margin">
            <CompanyShortInfo
                company={company}
                onShowScreenChange={onShowScreenChange}
            />
        </div>
        <div className="data-sharing-button-list">
            <DataSharingButton
                sharingType="dataTypes"
                count={company.dataTypesShared.length}
                max={maxValues.dataTypes}
                average={averageValues.dataTypes}
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
            <DataSharingButton
                sharingType="purposes"
                count={company.dataSharingPurposes.length}
                max={maxValues.purposes}
                average={averageValues.purposes}
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
            <DataSharingButton
                sharingType="companies"
                count={company.sharedWithCompanies.length}
                max={maxValues.companies}
                average={averageValues.companies}
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
            <DataSharingButton
                sharingType="jurisdictions"
                count={
                    company.jurisdictionsShared
                        ? company.jurisdictionsShared.children.length
                        : 0
                }
                max={maxValues.jurisdictions}
                average={averageValues.jurisdictions}
                showLegend="true"
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
        </div>
    </div>
);

export default FeaturedCompany;
