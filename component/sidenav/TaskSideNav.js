import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SectionContext } from "../../page/SharedLayout";
import 'font-awesome/css/font-awesome.min.css';
import { AppAPI } from "../../api/AppAPI";
import { Common } from "../../utility/Common";
import Loading from "../common/Loading";
import { AppContext } from "../../App";

const TaskSideNav = props => {

    const unActiveNav = "side-nav-child x-axis-flex";
    const activeNav = "side-nav-child active-side-nav x-axis-flex";

    const [taskSideNavSections, setTaskSideNavSections] = useState(null);
    const { subscribeToTaskChange, unSubscribeToTaskChange } = useContext(AppContext);
    const { id } = props;

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
        if(mode === Common.TaskEventConstants.TASK_UPDATE) {
            return;
        }
        fetchSideNavs();
    }

    const fetchSideNavs = async () => {
        const response = await AppAPI.getSideNavbars();
        if(response.status !== 200) {
            throw new Error("Error while fetching side nav data");
        }
        const sideNavs = response.sideNavList;
        setTaskSideNavSections(sideNavs);
    }

    const { setSection } = useContext(SectionContext);

    const maintainSection = event => {
        setSection(event.currentTarget.getAttribute("data-section-name"));
    }
    
    if(!taskSideNavSections) {
        return <Loading />
    }

    const taskSideNavElements = taskSideNavSections ? taskSideNavSections.map(elem => {
        let urlName = elem.name.replace(" ", "-");
        urlName = urlName.toLowerCase();
        return (
            <NavLink 
                to={`./task/${urlName}`} 
                className={({ isActive }) => {
                    return isActive ? activeNav
                                    : unActiveNav
                }}
                onClick={ maintainSection }
                key={elem.id}
                data-section-name={elem.name}
            >
                <i className={elem.iconClassNames}></i>
                <p>{elem.name}</p>
                { elem.count ? <div className="count-box x-axis-flex">
                                        <p>{elem.count}</p>
                                    </div> : ""}
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