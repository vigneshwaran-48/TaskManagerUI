import React, { useContext } from "react";
import 'font-awesome/css/font-awesome.min.css';
import TaskSideNav from "./TaskSideNav";
import ListSideNav from "./ListSideNav";
import { UserContext } from "../../App";

const SideNavbar = () => {

    const { changeUserDetails } = useContext(UserContext);

    const logoutAction = () => {
        changeUserDetails({ isLoggedIn: false });
    }

    const closeSideNav = () => {
        document.querySelector(".side-navbar")
                .classList.remove("open-side-nav");
    }
    return (
        <div className="side-navbar y-axis-flex">
        <div className="side-nav-top x-axis-flex">
            <h2>Menu</h2>
            <i 
                onClick={closeSideNav}
                className="bi bi-x"
            ></i>
        </div>
        <div className="side-nav-top-part">
            <TaskSideNav />
            <hr />
            <ListSideNav />
            <hr />
        </div>
        <div className="side-nav-bottom y-axis-flex">
            <div className="common-button settings-button x-axis-flex">
                <i className="fa fa-solid fa-gear"></i>
                <p>Settings</p>
            </div>
            <hr />
            <button 
                onClick={logoutAction}
                className="common-button"
            >Sign out</button>
        </div>
        </div>
    )
}

export default SideNavbar;