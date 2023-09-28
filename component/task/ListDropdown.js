import React from "react";

const ListDropdown = props => {

    const { options, onChange } = props;
    
    const handleOptionClick = event => {
        const { optionId } = event.currentTarget.dataset;
        console.log(optionId);
        onChange(options.find(option => option.id === parseInt(optionId)));
    }
    console.log("drop down rendered ....");
    console.log(options);
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
    console.log(optionElems)
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
            onClick={() => console.log("Hi")}
            data-option-id={id}
        >
            <p>{ name }</p>
        </div>
    )
}

export default ListDropdown;