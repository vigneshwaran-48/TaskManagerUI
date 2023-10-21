import React, { useEffect, useRef, useState } from 'react'

const Dropdown = props => {

    const { items, isOpen, subItems } = props;
    const [ isSubDropdownOpen, setIsSubDropdownOpen ] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const autoCloseOnExit = event => {
            if(isSubDropdownOpen && ref.current && !ref.current.contains(event.target)) {
                setIsSubDropdownOpen(false);
            }
            else {
                console.log("Not closing ...")
            }
        }
        document.addEventListener("mousedown", autoCloseOnExit);
        document.addEventListener("touchstart", autoCloseOnExit);

        return () => {
            document.removeEventListener("mousedown", autoCloseOnExit);
            document.removeEventListener("touchstart", autoCloseOnExit);
        }
    }, [isSubDropdownOpen]);

    const handleSubDropdownClick = () => {
        setIsSubDropdownOpen(true);
    }

    const onMouseLeave = () => {
        setIsSubDropdownOpen(false);
    }

    const onMouseEnter = () => {
        setIsSubDropdownOpen(true);
    };

    const itemsElems = items ? items.map(item => {
        return (
            <li className={`drop-down-item x-axis-flex`} key={item.id}>
                <p>{ item.name }</p>
                <div 
                    className="sub-drop-down-button x-axis-flex" 
                    onClick={handleSubDropdownClick}
                >
                    <i className="fa fa-solid fa-angle-right"></i>
                </div>
                <Dropdown 
                        items={item.subItems}
                        subItems={true} />
            </li>
        );
    }): null;

    return (
        <ul 
            className={`multi-drop-down hide-scrollbar
                        ${subItems ? "sub-drop-down" : ""} ${isSubDropdownOpen || isOpen ? "show-drop-down" : ""}`}
            ref={ref}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
        >
            { itemsElems }
        </ul>
    )
}

export default Dropdown;
