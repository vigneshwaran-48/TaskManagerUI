import React, { useEffect, useRef, useState } from 'react'

const Dropdown = props => {

    const { items, isOpen, subItems, onListClick, isCheckboxDropdown } = props;

    if(isCheckboxDropdown) {
        return <DropdownCheckbox 
                    items={items} 
                    isOpen={isOpen}
                    onListClick={onListClick}
                    subItems={subItems} />
    }

    const itemsElems = items ? items.map(item => {
        return (
            <li 
                className={`drop-down-item x-axis-flex`} 
                key={item.id}
                onClick={event =>{
                    event.stopPropagation();
                    !item.subItems && onListClick(item);
                }}
            >
                <p className="x-axis-flex">
                    { item.name } 
                    {item.subItems ? <i className="fa fa-solid fa-angle-right"></i> : ""}
                </p>
                <Dropdown 
                    items={item.subItems}
                    subItems={true} 
                    onListClick={onListClick}
                    isCheckboxDropdown={item.isCheckboxDropdown}
                />
            </li>
        );
    }): null;

    return (
        <ul 
            className={`multi-drop-down hide-scrollbar ${subItems ? "sub-drop-down" : ""} 
            ${isOpen ? "show-drop-down" : ""}`}
        >
            { itemsElems }
        </ul>
    )
}

const DropdownCheckbox = props => {

    const { items, isOpen, subItems, onListClick } = props;

    const [ checkboxItems, setCheckboxItems ] = useState(items);

    const handleCheckboxChange = event => {
        const { name, checked } = event.target;

        const mapped = checkboxItems.map(elem => {
            if(elem.name === name) {
                elem.checked = checked;
            }
            return elem;
        });
        
        setCheckboxItems(mapped);
        onListClick(mapped);
    }

    console.log("rendered drop down checkbox");
    const elems = checkboxItems ? checkboxItems.map(item => {
        return (
            <li 
                className={`drop-down-item x-axis-flex`} 
                key={item.id}
                onFocus={event =>{
                    event.stopPropagation();
                }}
            >
                <p className="x-axis-flex">
                    <input 
                        type="checkbox" 
                        name={item.name}
                        onClick={ handleCheckboxChange }
                    />
                    { item.name } 
                </p>
            </li>
        )
    }) : checkboxItems;

    return (
        <ul 
            className={`multi-drop-down hide-scrollbar ${subItems ? "sub-drop-down" : ""}
             ${isOpen ? "show-drop-down" : ""}`}
        >
            { elems }
        </ul>
    )
}

export default Dropdown;
