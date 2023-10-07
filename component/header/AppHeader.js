import React, { useEffect, useState } from 'react'
import Searchbar from '../../utility/Searchbar';
import { TaskAPI } from '../../api/TaskAPI';
import { Common } from "../../utility/Common";
import "../../css/header.css";
import SearchResults from './SearchResults';
import SearchOverview from './SearchOverview';

const AppHeader = props => {

    useEffect(() => {
        handleSearch("");
    }, []);

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
            /**
             * Setting clicked row as the first task here.
             * If the tasks is empty then previous will be setted,
             * Although that is not required.
             */
            setSearchResults(prev => {
                return {
                    ...prev,
                    isLoading: false,
                    data: response.tasks,
                    clickedRow: response.tasks.length > 0 ? response.tasks[0].taskId : prev.clickedRow
                }
            });
            if(response.status === 204) {
                // Closing the overview if the results is empty
                setOverview(prev => ({...prev, isOpen: false}));
            }
            if(response.tasks.length > 0) {
                // Setting overview task details as the first element.
                setOverview(prev => ({...prev, taskDetails: response.tasks[0]}));
            }
        }
        else {
            Common.showErrorPopup(response.error, 2);
        }
    }

    const handleSearchResultClick = taskDetails => {
        setSearchResults(prev => ({...prev, clickedRow: taskDetails.taskId}));
        setOverview({
            isOpen: true,
            taskDetails
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
            <div 
                className="search-container y-axis-flex"
                tabIndex={0}
            >
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
                        taskDetails={overview.taskDetails}
                        closeOverview={handleOverviewClose}
                    />
                </div>
            </div>
        </header>
    )
}

export default AppHeader;