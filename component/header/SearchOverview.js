import NothingToShow from "../../utility/NothingToShow";
import React from "react";

const getDateTime = dateTime => {
    const date = new Date(dateTime);
    const splittedDateTime = date.toString().split("GMT")
    return splittedDateTime[0];
}
const SearchOverview = props => {

    const { taskDetails, isOpen, closeOverview } = props;

    return (
        <div className={`search-result-overview y-axis-flex ${isOpen ? "open-search-overview" : ""}`}>
            <i 
                onClick={ closeOverview }
                className="bi bi-x"
            ></i>
            {
               taskDetails 
               ? (
                <div className="search-result-overview-data y-axis-flex">
                    <p className="overview-single-data-taskname">{ taskDetails.taskName }</p>
                    <div className="overview-single-data-container x-axis-flex">
                        <p className="overview-single-data-label">Description: </p>
                        <p>{ taskDetails.description }</p>
                    </div>
                    <div className="overview-single-data-container x-axis-flex">
                        <p className="overview-single-data-label">Due date: </p>
                        <p>{ taskDetails.dueDate }</p>
                    </div>
                    <div className="overview-single-data-container x-axis-flex">
                        <p className="overview-single-data-label">Created Time: </p>
                        <p>{ getDateTime(taskDetails.createdTime) }</p>
                    </div>
                </div>
               ) 
               : <NothingToShow message="No Data!" />
            }
        </div>
    )
}

export default SearchOverview;