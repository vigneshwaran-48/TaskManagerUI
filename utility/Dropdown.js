import React, { useEffect, useRef, useState } from 'react'
import { Common } from './Common';

const Dropdown = props => {

    const { items, isOpen, theme, subItems, onListClick, isCheckboxDropdown } = props;

    if(isCheckboxDropdown) {
        return <DropdownCheckbox 
                    items={items} 
                    isOpen={isOpen}
                    onListClick={onListClick}
                    theme={theme}
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
                    theme={theme}
                />
            </li>
        );
    }): null;

    return (
        <ul 
            className={`multi-drop-down hide-scrollbar ${subItems ? "sub-drop-down" : ""} 
            ${isOpen ? "show-drop-down" : ""} ${theme === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`}
        >
            { itemsElems }
        </ul>
    )
}

const DropdownCheckbox = props => {

    // Should maintain a state for prop "items" in the component that using this Dropdown
    const { items, isOpen, theme, subItems, onListClick } = props;

    const handleCheckboxChange = event => {
        const { name, checked } = event.target;

        const mapped = items.map(elem => {
            if(elem.name === name) {
                elem.checked = checked;
            }
            return elem;
        });

        onListClick(mapped);
    }

    const elems = items ? items.map(item => {
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
                        checked={item.checked}
                        onChange={ handleCheckboxChange }
                    />
                    { item.name } 
                </p>
            </li>
        )
    }) : items;

    return (
        <ul 
            className={`multi-drop-down hide-scrollbar ${subItems ? "sub-drop-down" : ""}
             ${isOpen ? "show-drop-down" : ""} ${theme === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`}
        >
            { elems }
        </ul>
    )
}

export default Dropdown;
