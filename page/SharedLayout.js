import React, { Suspense, createContext, useEffect, useRef, useState } from "react";
import SideNavbar from "../component/sidenav/SideNavbar";
import "../css/side-nav.css";
import "../css/app-body.css";
import { useLocation, defer, useLoaderData, Await } from "react-router";  
import 'font-awesome/css/font-awesome.min.css';
import { Common } from "../utility/Common";
import { ListAPI } from "../api/ListAPI";
import MainBody from "./MainBody";
import AppHeader from "../component/header/AppHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppAPI } from "../api/AppAPI";
import Loading from "../component/common/Loading";
import { updateSettingsByOption, updateShouldGroupTasks } from "../features/settingsSlice";

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

export const appLoader = async () => {
    return defer({
        settings: AppAPI.getSettings()
    });
}

const SharedLayout = () => {

    const appLoadedRef = useRef(false);

    const [ section, setSection ] = useState("");

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));

    const appLoaderData = useLoaderData();

    const dispatch = useDispatch();
    
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

    const render = settingsResponse => {

        if(!appLoadedRef.current) {
            if(settingsResponse.status !== 200) {
                console.error("Error while getting settings data");
                console.error(settingsResponse.error);
            }
    
            dispatch(updateShouldGroupTasks({value: settingsResponse.data.shouldGroupTasks}));
            dispatch(updateSettingsByOption({
                sectionName: Common.SettingsSectionName.GROUP_BY,
                value: settingsResponse.data.groupBy
            }));
            dispatch(updateSettingsByOption({
                sectionName: Common.SettingsSectionName.THEME,
                value: settingsResponse.data.theme
            }));
            dispatch(updateSettingsByOption({
                sectionName: Common.SettingsSectionName.SORT,
                value: settingsResponse.data.sortBy
            }));
            dispatch(updateSettingsByOption({
                sectionName: Common.SettingsSectionName.SORT_GROUP_BY,
                value: settingsResponse.data.sortGroupBy
            }));

            appLoadedRef.current = true;
        }

        return (
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
        )
    }

    return (
        <SectionContext.Provider value={{
            section,
            setSection
        }}>
        <Suspense fallback={<Loading />}>
            <Await resolve={appLoaderData.settings}>
                { render }
            </Await>
        </Suspense>
        </SectionContext.Provider>
    )
}

export default SharedLayout;