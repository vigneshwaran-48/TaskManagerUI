import React from "react";
import { Outlet } from "react-router";

const WelcomeSharedLayout = () => {

    return (
        <div className="get-started-page y-axis-flex">
            <div className="welcome-box x-axis-flex">
                <h1>Todo App</h1>
                <img 
                    className="welcome-image"
                    src="/images/welcome-image.jpg" 
                    alt="welcome" />
            </div>
            <Outlet />
        </div>
    )
}

export default WelcomeSharedLayout;