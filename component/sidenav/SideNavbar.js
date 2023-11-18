import React, { useContext } from "react";
import 'font-awesome/css/font-awesome.min.css';
import TaskSideNav from "./TaskSideNav";
import ListSideNav from "./ListSideNav";
import { UserContext } from "../../App";
import { AppAPI } from "../../api/AppAPI";
import { Common } from "../../utility/Common";
import { Link } from "react-router-dom";

const SideNavbar = props => {

    const { closeSideNavbar } = props;
    const { changeUserDetails } = useContext(UserContext);

    const logoutAction = async () => {
        const response = await AppAPI.logout();
        if(response.ok) {
            window.location.href = Common.authServerPage;
        }
    }

    return (
        <div className="side-navbar y-axis-flex">
        <div className="side-nav-top x-axis-flex">
            <h2>Menu</h2>
            <i 
                onClick={closeSideNavbar}
                className="bi bi-x"
            ></i>
        </div>
        <div className="side-nav-top-part">
            <TaskSideNav id="app-side-navbar-task" closeSideNavbar={closeSideNavbar} />
            <hr />
            <ListSideNav id="app-side-navbar-list" closeSideNavbar={closeSideNavbar} />
            <hr />
        </div>
        <div className="side-nav-bottom y-axis-flex">
            <Link to="./settings" className="common-button settings-button x-axis-flex">
                <i className="fa fa-solid fa-gear"></i>
                <p>Settings</p>
            </Link>
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