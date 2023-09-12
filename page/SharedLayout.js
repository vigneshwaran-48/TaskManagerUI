import React, { createContext, useEffect, useState } from "react";
import SideNavbar from "../component/sidenav/SideNavbar";
import "../css/side-nav.css";
import "../css/app-body.css";
import { Outlet, useLocation } from "react-router";  
import 'font-awesome/css/font-awesome.min.css';
import { Common } from "../utility/Common";

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
    
    const sideNavOpenAction = () => {
        document.querySelector(".side-navbar")
                .classList.add("open-side-nav");
    }

    const location = useLocation();
    
    useEffect(() => {
        const splittedUrl = location.pathname.split("/");
        let currentSection = "Upcoming";
        
        if(splittedUrl.length > 2) {
            currentSection = splittedUrl[3];
        }
        const formattedCurrentSection = formatHeading(currentSection)
        setSection(formattedCurrentSection);
    }, []);

    return (
        <SectionContext.Provider value={{
            section,
            setSection
        }}>
            <div className="todo x-axis-flex">
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
                <SideNavbar />
                <div className="app-body y-axis-flex">
                    <div className="app-body-header x-axis-flex">
                        <i 
                            onClick={sideNavOpenAction}
                            className="fa fa-solid fa-bars"
                        ></i>
                        <h1>{ section }</h1>
                    </div>
                    <Outlet />
                </div>
            </div>
        </SectionContext.Provider>
    )
}

export default SharedLayout;