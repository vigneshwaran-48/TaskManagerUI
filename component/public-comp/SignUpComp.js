import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/UserAPI";
import { UserContext } from "../../App";

const SignUpComp = () => {

    const [formDetails, setFormDetails] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        name: ""
    });
    const navigate = useNavigate();
    const { changeUserDetails } = useContext(UserContext);

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
        formDetails.name = formDetails.firstName;
        const response = await UserAPI.signUp(formDetails);

        if(response.ok) {
            const jsonResp = await response.json();
            const authResponse = await UserAPI
                                    .authenticate(formDetails.email, formDetails.password);
            if(authResponse.ok) {
                const authJson = authResponse.json();
                UserAPI.setKey(authJson.data);
                const userDetails = {
                    name: formDetails.name,
                    key: authJson.key,
                    userId: jsonResp.id
                }
                changeUserDetails(userDetails);
                navigate("/todo");
            }
        }
    }

    return (
        <div className="sign-up-comp y-axis-flex">
            <h1>Sign Up</h1>
            <form 
                onSubmit={handleSubmit}
                className="sign-up-form y-axis-flex">
                <input 
                    type="text" 
                    placeholder="first name" 
                    name="firstName"
                    value={formDetails.firstName}
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="last name" 
                    name="lastName"
                    value={formDetails.lastName}
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    placeholder="email" 
                    name="email"
                    value={formDetails.email}
                    onChange={handleChange}
                />
                <input 
                    type="password" 
                    placeholder="password" 
                    name="password"
                    value={formDetails.password}
                    onChange={handleChange}
                />
                <button className="common-button">Sign Up</button>
            </form>
            <Link to="../login">Already have an account? Sign in here</Link>
        </div>
    )
}

export default SignUpComp;