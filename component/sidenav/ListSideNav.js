import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SectionContext } from "../../page/SharedLayout";
import ListTagAddComp from "./ListTagAddComp";
import { AppAPI } from "../../api/AppAPI";
import { Common } from "../../utility/Common";
import Loading from "../common/Loading";
import Nav from "./Nav";
import { ListAPI } from "../../api/ListAPI";

const ListSideNav = props => {

    const activeSideNav = "side-nav-child active-side-nav x-axis-flex";
    const unActiveSideNav = "side-nav-child x-axis-flex"

    const { setSection } = useContext(SectionContext);

    const [ openListBox, setOpenBox ] = useState(false);

    const { closeSideNavbar } = props;

    const [ list, setList ] = useState([]);

    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        fetchListSideNav();
    }, []);

    const fetchListSideNav = async () => {
        setIsLoading(true);
        const response = await AppAPI.getListSideNav();
        if(response.status === 200) {
            setList(response.sideNavList);
        }
        else {
            Common.showErrorPopup("Error while fetching lists");
        }
        setIsLoading(false);
    }

    const maintainSection = event => {
        setSection(event.target.innerText);
        closeSideNavbar();
    }

    const addList = async listDetails => {
        
        const response = await ListAPI.addList(listDetails);
        if(response.status === 201) {
            Common.showSuccessPopup(response.message, 2);
            setOpenBox(false);
        }
        else {
            Common.showErrorPopup(response.error, 2);
        }
    }

    if(!list) {
        return <Loading />
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
                <Nav 
                    name={elem.name}
                    count={elem.taskCount}
                    leftElem={
                        <div 
                            style={{
                                backgroundColor: elem.color
                            }}
                            className="tag-list-color-box"
                        ></div>
                    }
                    isLoading={isLoading}
                    listColor={elem.color}
                />
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
                                addList={addList}
                             />}
        </nav>
    )
}

export default ListSideNav;