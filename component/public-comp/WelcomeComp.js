import React from "react";
import { Link } from "react-router-dom";

const WelcomeComp = () => {

    return (
        <div className="welcome-comp y-axis-flex">
            <h1>Productive Mind</h1>
            <p>With only features you need, Organic Mind is customized for
                individuals seeking a stress-free way to stay focused on their goals,
                 projects, and tasks.
            </p>
            <Link to="sign-up" className="get-start-link">
                <button className="common-button">Get Started</button>
            </Link>
            <Link to="login">Already have an account? Sign in here</Link>
        </div>
    )
}

export default WelcomeComp;