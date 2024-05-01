import React from "react";

const ListDropdown = props => {

    const { options, onChange } = props;
    
    const handleOptionClick = event => {
        const { optionId } = event.currentTarget.dataset;
        onChange(options.find(option => option.id === optionId));
    }
    const optionElems = options.map(option => {
        return (
            <Option 
                key={`list-drop-down-elem-${option.id}`}
                name={option.name} 
                id={option.id} 
                handleOptionClick={handleOptionClick}
            />
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

const Option = props => {

    const { handleOptionClick, id, name } = props;

    return (
        <div 
            onFocus={handleOptionClick}
            data-option-id={id}
            tabIndex={0}
        >
            <p>{ name }</p>
        </div>
    )
}

export default ListDropdown;