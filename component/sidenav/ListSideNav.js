import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { SectionContext } from "../../page/SharedLayout";
import ListTagAddComp from "./ListTagAddComp";

const ListSideNav = () => {

    const activeSideNav = "side-nav-child active-side-nav x-axis-flex";
    const unActiveSideNav = "side-nav-child x-axis-flex"

    const { setSection } = useContext(SectionContext);

    const [ openListBox, setOpenBox ] = useState(false);

    const maintainSection = event => {
        setSection(event.target.innerText);
    }

    const defaultList = [
        {
            id: 10001,
            name: "Personal",
            taskCount: 0,
            color: "#8ce99a"
        },
        {
            id: 10002,
            name: "Work",
            taskCount: 10,
            color: "#fe6a6b"
        }
    ]
    const [ list, setList ] = useState([]);

    if(!list || list.length < 1) {
        setList(defaultList);
    }

    const listElements = list.map(elem => {
        return (
            <NavLink 
                key={`list-${elem.id}`}
                className={ ( { isActive } ) => {
                    return isActive ? activeSideNav
                                    : unActiveSideNav
                } }
                to={`./list/${elem.id}`}
                onClick={maintainSection}
            >
                <div 
                    style={{
                        backgroundColor: elem.color
                    }}
                    className="tag-list-color-box"
                ></div>
                <p>{ elem.name }</p>
                { elem.taskCount ? <div className="count-box x-axis-flex">
                                        <p>{elem.taskCount}</p>
                                    </div> : ""}
            </NavLink>
        );
    });

    return (
        <nav className="list-side-nav y-axis-flex">
            <h4>List</h4>
            <div className="list-side-nav-child-wrapper y-axis-flex">
                { listElements }
            </div>
            <button 
                onClick={() => setOpenBox(prev => !prev)}
                className="common-button add-new-list-button x-axis-flex"
            >
                {!openListBox && <i className="fa fa-solid fa-plus"></i>}
                <p>{ openListBox ? "Close" : "Add New List"}</p>
            </button>
            { openListBox && <ListTagAddComp 
                                setOpenBox={setOpenBox} 
                                isTag={false}
                             />}
        </nav>
    )
}

export default ListSideNav;