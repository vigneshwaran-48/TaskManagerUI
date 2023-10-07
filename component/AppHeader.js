import React, { useEffect, useState } from 'react'
import Searchbar from '../utility/Searchbar';
import { TaskAPI } from '../api/TaskAPI';
import { Common } from "../utility/Common";
import Loading from "./common/Loading";
import NothingToShow from "../utility/NothingToShow";
import "../css/header.css";

const AppHeader = props => {

    const { sideNavOpenAction } = props;

    const [ searchResults, setSearchResults ] = useState({
        isLoading: true,
        data: null,
        clickedRow: -1
    });

    const [ overview, setOverview ] = useState({
        isOpen: false,
        taskDetails: null
    });

    const handleSearch = async text => {
        const response = await TaskAPI.getTasksWithName(text);
        if(response.status === 200 || response.status === 204) {
            setSearchResults({
                isLoading: false,
                data: response.tasks,
            });
        }
        else {
            Common.showErrorPopup(response.error, 2);
        }
    }

    const handleSearchResultClick = taskDetails => {
        setSearchResults(prev => ({...prev, clickedRow: taskDetails.taskId}));
        setOverview({
            isOpen: true,
            data: taskDetails
        });
    }

    const handleOverviewClose = () => {
        setOverview(prev => ({...prev, isOpen: false}));
    }

    return (
        <header className="app-header x-axis-flex">
            <i 
                onClick={sideNavOpenAction}
                className="fa fa-solid fa-bars"
            ></i>
            <div  className="search-container y-axis-flex" tabIndex={0}>
                <Searchbar onSearch={handleSearch} />
                <div className="search-results-and-overview x-axis-flex">
                    <SearchResults 
                        searchResults={searchResults.data} 
                        isLoading={searchResults.isLoading}
                        handleClick={ handleSearchResultClick }
                        activeRow={searchResults.clickedRow}
                    />
                    <SearchOverview
                        isOpen={overview.isOpen}
                        taskDetails={overview.data}
                        closeOverview={handleOverviewClose}
                    />
                </div>
            </div>
        </header>
    )
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
                </div>
               ) 
               : <NothingToShow message="No Data!" />
            }
        </div>
    )
}

const SearchResults = props => {

    const { searchResults, isLoading, handleClick, activeRow } = props;
    const [ data, setData ] = useState(null);

    useEffect(() => {
        console.log(searchResults);
        setData(searchResults);
    }, [searchResults]);

    let resultsElem;

    if(isLoading) {
        resultsElem = <Loading />
    }
    else if(data && data.length > 0) {
        resultsElem = data.map(result => {
            return (
                <div 
                    key={result.taskId} 
                    className={`search-result x-axis-flex ${activeRow === result.taskId ? "active-search-result" : ""}`}
                    onClick={ () => handleClick(result) }
                >
                    <p>{ result.taskName }</p>
                </div>
            );
        })
    }
    else {
        resultsElem = <NothingToShow message="No results!" />
    }

    return (
        <div className="search-results-container y-axis-flex">
            { resultsElem }
        </div>
    )

}

export default AppHeader;