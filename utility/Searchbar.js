import React, { useState } from 'react'

const Searchbar = props => {

    const { onSearch, onEnter } = props;

    const [ searchText, setSearchText ] = useState("");

    const handleInputChange = event => {
        const { value } = event.target;
        setSearchText(value);
        onSearch(value);
    }

    return (
        <div className="search-bar x-axis-flex" tabIndex={0}>
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
