import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/UserAPI";
import { UserContext } from "../../App";

const SignInComp = () => {

    const [formDetails, setFormDetails] = useState({
        email: "",
        password: ""
    });
    
    const { changeUserDetails } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = event => {
        const { name, value } = event.target;
        setFormDetails(prevFormDetails => {
            return {
                ...prevFormDetails,
                [ name ]: value
            }
        })
    }

    const handleSubmit = async event => {
        event.preventDefault();
        const response = await UserAPI.authenticate(formDetails.email, formDetails.password);
        
        if(response.ok) {
            const respBody = await response.json();
            changeUserDetails(respBody);

            navigate("/todo");
        }
    }
    
    return (
        <div className="sign-in-comp y-axis-flex">
            <h1>Sign In</h1>
            <form 
                onSubmit={handleSubmit}
                className="sign-in-form y-axis-flex">
                <input 
                    type="text" 
                    placeholder="email" 
                    value={formDetails.email}
                    name="email"
                    onChange={handleChange}
                    autoComplete="true"
                />
                <input 
                    type="password" 
                    placeholder="password" 
                    value={formDetails.password}
                    name="password"
                    onChange={handleChange}
                    autoComplete="true"
                />
                <button className="common-button">Sign in</button>
            </form>
            <Link to="../sign-up">Need an account? Sign up here</Link>
        </div>
    )
}

export default SignInComp;