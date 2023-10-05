import React from 'react'
import Searchbar from '../utility/Searchbar';

const AppHeader = props => {

    const { sideNavOpenAction } = props;

    const handleSearch = text => {
        console.log("Search text => " + text);
    }

    return (
        <header className="app-header x-axis-flex">
            <i 
                onClick={sideNavOpenAction}
                className="fa fa-solid fa-bars"
            ></i>
            <div  className="search-container y-axis-flex" tabIndex={0}>
                <Searchbar onSearch={handleSearch} />
                <div className="search-results-container x-axis-flex"></div>
            </div>
        </header>
    )
}

export default AppHeader;