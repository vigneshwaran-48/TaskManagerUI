import React, { useContext, useEffect } from 'react'
import { motion } from 'framer-motion';
import { Common } from '../utility/Common';
import "../css/settings.css";
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SectionContext } from './SharedLayout';

const Settings = () => {

    const { setSection } = useContext(SectionContext);

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));

    useEffect(() => {
        setSection("Settings");
    }, []);

    const ACTIVE_CLASSNAME = `settings-navbar active-settings-navbar 
        ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`;
    const INACTIVE_CLASSNAME = `settings-navbar 
        ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`;

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle today-comp settings-comp x-axis-flex"
        >
            <div className="settings-navigation-bar hide-scrollbar y-axis-flex">
                <NavLink className={({isActive}) => isActive ? ACTIVE_CLASSNAME : INACTIVE_CLASSNAME} to="./general">
                    <p>General</p>
                </NavLink>
                <NavLink className={({isActive}) => isActive ? ACTIVE_CLASSNAME : INACTIVE_CLASSNAME} to="./import-export">
                    <p>Import/Export Data</p>
                </NavLink>
            </div>
            <div className="settings-page">
                <Outlet />
            </div>
        </motion.div>
    )
}

export default Settings;