import React, { useState } from 'react'
import { Common } from './Common';

const Searchbar = props => {

    const { onSearch, onEnter, theme = Common.Theme.LIGHT } = props;

    const [ searchText, setSearchText ] = useState("");

    const handleInputChange = event => {
        const { value } = event.target;
        setSearchText(value);
        onSearch(value);
    }

    return (
        <div 
            className={`search-bar x-axis-flex ${theme === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`} tabIndex={0}>
            <i className="bi bi-search"></i>
            <input 
                name="search-text" 
                value={ searchText }
                onChange={handleInputChange}
                placeholder="Search"
            />
        </div>
    )
}

export default Searchbar;
