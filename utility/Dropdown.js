import React, { useEffect, useRef, useState } from 'react'

const Dropdown = props => {

    const { items, isOpen, subItems, onListClick } = props;
    const ref = useRef();

    const itemsElems = items ? items.map(item => {
        return (
            <li 
                className={`drop-down-item x-axis-flex`} 
                key={item.id}
                onClick={event =>{
                    event.stopPropagation();
                    onListClick(item);
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
                />
            </li>
        );
    }): null;

    return (
        <ul 
            className={`multi-drop-down hide-scrollbar ${subItems ? "sub-drop-down" : ""} 
            ${isOpen ? "show-drop-down" : ""}`}
            ref={ref}
        >
            { itemsElems }
        </ul>
    )
}

export default Dropdown;
