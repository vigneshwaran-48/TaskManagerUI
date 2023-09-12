import React from "react";

const ListDropdown = props => {

    const { options, onChange } = props;
    
    const handleOptionClick = event => {
        const { optionId } = event.currentTarget.dataset;
        onChange(options.find(option => option.id === parseInt(optionId)));
    }
    const optionElems = options.map(option => {
        return (
            <div 
                onClick={handleOptionClick}
                data-option-id={option.id}
                key={option.id}
            >
                <p>{ option.name }</p>
            </div>
        )
    })
    return (
        <div 
            className="drop-down-wrapper"
        >
            <div className="drop-down-choose-button" tabIndex={0}>
                <p>Choose</p>
            </div>
            <div className="drop-down">
                { optionElems }
            </div>
        </div>
    )
}

export default ListDropdown;