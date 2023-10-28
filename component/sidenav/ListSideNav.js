import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SectionContext } from "../../page/SharedLayout";
import ListTagAddComp from "./ListTagAddComp";
import { AppAPI } from "../../api/AppAPI";
import { Common } from "../../utility/Common";
import Loading from "../common/Loading";
import Nav from "./Nav";
import { ListAPI } from "../../api/ListAPI";
import { AppContext } from "../../App";

const PERSONALID = "6";
const WORKID = "7";

const ListSideNav = props => {

    const activeSideNav = "side-nav-child active-side-nav x-axis-flex";
    const unActiveSideNav = "side-nav-child x-axis-flex"

    const { setSection } = useContext(SectionContext);

    const [ openListBox, setOpenBox ] = useState(false);

    const { closeSideNavbar, id } = props;

    const [ list, setList ] = useState([]);

    const [ isLoading, setIsLoading ] = useState(false);

    const { subscribeToTaskChange, unSubscribeToTaskChange } = useContext(AppContext);

    const navigate = useNavigate();

    useEffect(() => {
        //Subscribing to the task change event
        const listener = {
           listenerId: id,
           callback: taskChangeHandler
        }
        subscribeToTaskChange(listener);

        return (() => {
            //Unsubscribing to the task change event
            unSubscribeToTaskChange(id);
        })
    });

    const taskChangeHandler = (taskDetails, mode) => {
        fetchListSideNav();
    }

    useEffect(() => {
        fetchListSideNav();
    }, []);

    const fetchListSideNav = async () => {
        setIsLoading(true);
        const response = await ListAPI.getAllListsOfUser();
        if(response.status === 200) {
            setList(response.lists);
        }
        else {
            Common.showErrorPopup("Error while fetching lists");
        }
        setIsLoading(false);
    }

    const maintainSection = sectionName => {
        setSection(sectionName);
        closeSideNavbar();
    }

    const fetchAndAddList = async listId => {
        const response = await ListAPI.getListById(listId);
        if(response.status === 200) {
            const list = response.list;
            setList(prevList => {
                return [
                    ...prevList,
                    list
                ]
            });
        }
    }

    const addList = async (listDetails, callback) => {
        
        const response = await ListAPI.addList(listDetails);
        if(response.status === 201) {
            Common.showSuccessPopup(response.message, 2);
            setOpenBox(false);
            
            fetchAndAddList(response.listId);
        }
        else {
            Common.showErrorPopup(response.error, 2);
        }
        callback();
    }

    const handleDeleteList = async id => {
        const response = await ListAPI.deleteList(id);
        if(response.status === 200) {
            Common.showSuccessPopup(response.message, 2);

            setList(prevList => prevList.filter(l => l.listId !== id));
            navigate(`list/${PERSONALID}`);
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
                key={`list-${elem.listId}`}
                className={ ( { isActive } ) => {
                    return isActive ? activeSideNav
                                    : unActiveSideNav
                } }
                to={`./list/${elem.listId}`}
                onClick={() => maintainSection(elem.listName)}
            >
                <Nav 
                    name={elem.listName}
                    count={elem.taskCount}
                    leftElem={
                        <div 
                            style={{
                                backgroundColor: elem.listColor
                            }}
                            className="tag-list-color-box"
                        ></div>
                    }
                    isLoading={isLoading}
                    listColor={elem.listColor}
                    deleteIcon={
                        elem.listName !== "Personal" && elem.listName !== "Work" ?
                            <div className="list-delete-icon-wrapper">
                                <i 
                                    onClick={() => handleDeleteList(elem.listId)} 
                                    className="fa fa-solid fa-trash"></i>
                            </div>
                        : null
                    }
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
                                key="list-tag-add-comp"
                                setOpenBox={setOpenBox} 
                                isTag={false}
                                addList={addList}
                             />}
        </nav>
    )
}

export default ListSideNav;