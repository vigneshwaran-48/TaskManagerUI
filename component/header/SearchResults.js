import React, { useEffect, useState } from "react";
import Loading from "../common/Loading";
import NothingToShow from "../../utility/NothingToShow";

const SearchResults = props => {

    const { searchResults, isLoading, handleClick, activeRow } = props;
    const [ data, setData ] = useState(null);

    useEffect(() => {
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

export default SearchResults;