import React, { createContext, useEffect, useState } from "react";
import SideNavbar from "../component/sidenav/SideNavbar";
import "../css/side-nav.css";
import "../css/app-body.css";
import { useLocation } from "react-router";  
import 'font-awesome/css/font-awesome.min.css';
import { Common } from "../utility/Common";
import { ListAPI } from "../api/ListAPI";
import MainBody from "./MainBody";
import AppHeader from "../component/header/AppHeader";
import { useSelector } from "react-redux";

const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const formatHeading = str => {
    if(!str) return;

    const splittedStr = str.split("-");
    let temp = capitalize(splittedStr[0]);

    if(splittedStr && splittedStr.length > 1) {
        for(let i = 1;i < splittedStr.length;i ++) {
            temp += " " + capitalize(splittedStr[i]);
        }
    }
    return temp;
}

export const SectionContext = createContext();

const SharedLayout = () => {

    const [ section, setSection ] = useState("");

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));
    
    const sideNavOpenAction = () => {
        document.querySelector(".side-navbar")
                .classList.add("open-side-nav");
    }

    const closeSideNav = () => {
        document.querySelector(".side-navbar")
                .classList.remove("open-side-nav");
    }

    const location = useLocation();
    
    useEffect(() => {
        const splittedUrl = location.pathname.split("/");
        let currentSection = "Upcoming";
        
        if(splittedUrl.length > 2) {
            const topSection = splittedUrl[2];
            if(topSection === "list") {
                handleListSection(splittedUrl[3]);
                return;
            }
            currentSection = splittedUrl[2];
        }
        const formattedCurrentSection = formatHeading(currentSection)
        setSection(formattedCurrentSection);
    }, []);
    
    /**
     * 
     * In list section the url will have list's id instead of list name, So doing fetch call for getting list
     * name to set it as Section Name.
     * 
     */
    const handleListSection = async listId => {
        const response = await ListAPI.getListById(listId);
        if(response.status === 200) {
            setSection(response.list.listName);
        }
        else {
            Common.showErrorPopup("Error while fetching list details", 2);
        }
    }

    return (
        <SectionContext.Provider value={{
            section,
            setSection
        }}>
            <div 
                className={`todo x-axis-flex ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`}
            >
                <div className="popup error-popup x-axis-flex">
                    <i className="bi bi-x-circle-fill"></i>
                    <div className="popup-message">
                        <p className="error-popup-para">Error message dddddddddd</p>
                    </div>
                    <i 
                        className="bi bi-x" 
                        id="popup-close-button"
                        onClick={ () => Common.closeErrorPopupForce() }
                    ></i>
                </div>
                <div className="popup success-popup x-axis-flex">
                    <i className="fa fa-solid fa-check"></i>
                    <div className="popup-message">
                        <p className="success-popup-para">Success message dddddddddd</p>
                    </div>
                    <i 
                        className="bi bi-x" 
                        id="popup-close-button"
                        onClick={ () => Common.closeSuccessPopupForce() }
                    ></i>
                </div>
                <SideNavbar closeSideNavbar={closeSideNav} />
                <div className="app-body y-axis-flex">
                    <AppHeader sideNavOpenAction={sideNavOpenAction} />
                    <MainBody />
                </div>
            </div>
        </SectionContext.Provider>
    )
}

export default SharedLayout;