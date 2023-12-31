import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SectionContext } from "../../page/SharedLayout";
import 'font-awesome/css/font-awesome.min.css';
import { AppAPI } from "../../api/AppAPI";
import { Common } from "../../utility/Common";
import Loading from "../common/Loading";
import { AppContext } from "../../App";
import Nav from "./Nav";
import { useSelector } from "react-redux";

const TaskSideNav = props => {

    const [taskSideNavSections, setTaskSideNavSections] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const { subscribeToTaskChange, unSubscribeToTaskChange } = useContext(AppContext);
    const { id, closeSideNavbar } = props;

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));

    const unActiveNav = `side-nav-child x-axis-flex 
                        ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`;
    const activeNav = `side-nav-child active-side-nav x-axis-flex 
                        ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`;

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

    useEffect(() => {
        fetchSideNavs();
    }, []);

    const taskChangeHandler = (taskDetails, mode) => {
        fetchSideNavs();
    }

    const fetchSideNavs = async () => {
        setIsLoading(true);
        const response = await AppAPI.getSideNavbars();
        if(response.status !== 200) {
            throw new Error("Error while fetching side nav data");
        }
        const sideNavs = response.sideNavList;
        setTaskSideNavSections(sideNavs);
        setIsLoading(false);
    }

    const { setSection } = useContext(SectionContext);

    const maintainSection = event => {
        setSection(event.currentTarget.getAttribute("data-section-name"));
        closeSideNavbar();
    }
    
    if(!taskSideNavSections) {
        return <Loading />
    }

    const taskSideNavElements = taskSideNavSections ? taskSideNavSections.map(elem => {
        let urlName = elem.name.replace(" ", "-");
        urlName = urlName.toLowerCase();
        return (
            <NavLink 
                to={`./${urlName}`} 
                className={({ isActive }) => {
                    return isActive ? activeNav
                                    : unActiveNav
                }}
                onClick={ maintainSection }
                key={elem.id}
                data-section-name={elem.name}
            >
                <Nav 
                    name={elem.name} 
                    count={elem.count} 
                    leftElem={<i className={elem.iconClassNames}></i>}
                    id={elem.id}
                    isLoading={isLoading}
                />
            </NavLink>
        );
    }) : [];
    
    return (
        <nav className="task-side-nav y-axis-flex">
            <h4>Tasks</h4>
            { taskSideNavElements }
        </nav>
    )
}

export default TaskSideNav;