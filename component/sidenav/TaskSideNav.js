import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { SectionContext } from "../../page/SharedLayout";
import 'font-awesome/css/font-awesome.min.css';

const TaskSideNav = () => {
    const unActiveNav = "side-nav-child x-axis-flex";
    const activeNav = "side-nav-child active-side-nav x-axis-flex";

    const [taskSideNavSections, setTaskSideNavSections] = useState(null);

    const defaultTaskSections = [
        {
            id: 104,
            name: "Upcoming",
            taskCount: 3,
            iconClassNames: "fa fa-solid fa-forward"
        },
        {
            id: 105,
            name: "Today",
            taskCount: 7,
            iconClassNames: "bi bi-list-task"
        },
        {
            id: 107,
            name: "Calendar",
            iconClassNames: "fa fa-solid fa-calendar"
        },
        {
            id: 109,
            name: "Sticky Wall",
            iconClassNames: "bi bi-sticky"
        }
    ];

    const { setSection } = useContext(SectionContext);

    const maintainSection = event => {
        setSection(event.currentTarget.getAttribute("data-section-name"));
    }
    
    if(!taskSideNavSections || taskSideNavSections.length < 1) {
        setTaskSideNavSections(defaultTaskSections);
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
                { elem.taskCount ? <div className="count-box x-axis-flex">
                                        <p>{elem.taskCount}</p>
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