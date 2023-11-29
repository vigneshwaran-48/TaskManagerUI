import React from 'react'
import { useSelector } from 'react-redux';
import { Common } from '../utility/Common';
import "../css/dashboard.css";
import TotalTaskStats from '../component/dashboard/TotalTaskStats';

const Dashboard = () => {

    const theme = useSelector(state => state.settings.find(section => 
                        section.name === Common.SettingsSectionName.THEME).options[0].value);

    return (
        <div className={`dashboard hide-scrollbar x-axis-flex ${theme === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`}>
            <TotalTaskStats />
            <TotalTaskStats />
            <TotalTaskStats />
            <TotalTaskStats />
        </div>
    )
}

export default Dashboard;