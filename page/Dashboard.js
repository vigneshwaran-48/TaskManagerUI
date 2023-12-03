import React, { Suspense } from 'react'
import { useSelector } from 'react-redux';
import { Common } from '../utility/Common';
import "../css/dashboard.css";
import TotalTaskStats from '../component/dashboard/TotalTaskStats';
import { StatsAPI } from '../api/StatsAPI';
import { Await, useLoaderData } from 'react-router-dom';
import Loading from '../component/common/Loading';

export const dashboardLoader = async () => {
    return {totalTasks: StatsAPI.getTotalTaskStats()};
}

const Dashboard = () => {

    const dashboardLoaderData = useLoaderData();

    const theme = useSelector(state => state.settings.find(section => 
                        section.name === Common.SettingsSectionName.THEME).options[0].value);

    const render = totalTaskStats => {
        if(totalTaskStats.status !== 200) {
            Common.showErrorPopup(totalTaskStats.error, 2);
            return;
        }
        return <TotalTaskStats data={totalTaskStats.data} />;
    }

    return (
        <div className={`dashboard hide-scrollbar x-axis-flex ${theme === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`}>
            <Suspense fallback={<Loading />} >
                <Await resolve={dashboardLoaderData.totalTasks}>
                    {render}
                </Await>
            </Suspense>
        </div>
    )
}

export default Dashboard;