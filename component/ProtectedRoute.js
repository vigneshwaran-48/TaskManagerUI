import React, { useContext } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../App";

const ProtectedRoute = ( { children } ) => {

    const { userDetails } = useContext(UserContext);

    return (
        userDetails.isLoggedIn ? children
                               : <Navigate to="/" />
    )
}

export default ProtectedRoute;