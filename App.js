import React, { createContext, useState } from "react";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import WelcomeComp from "./component/public-comp/WelcomeComp";
import WelcomeSharedLayout from "./page/WelomeSharedLayout";
import SharedLayout from "./page/SharedLayout";
import TodayComp, { todayCompLoader } from "./component/task/TodayComp";
import TaskEditor, { taskEditorAction, taskEditorLoader } from "./component/task/TaskEditor";
import ListBody from "./component/ListBody";
import "./css/index.css";


export const UserContext = createContext();

const routes = createBrowserRouter(createRoutesFromElements(
    <Route path="/">
        <Route element={<WelcomeSharedLayout />}>
            <Route index element={<WelcomeComp />}/>
        </Route>
        <Route path="todo" element={<SharedLayout />}
        >
            <Route index element={(
                    () => <Navigate to="task/upcoming" />)()}
            />
            <Route path="task/upcoming" element={<h1>upcoming</h1>} />
            <Route 
                path="task/today" 
                element={<TodayComp />}
                loader={todayCompLoader}
            >
                <Route 
                    path=":id/edit" 
                    element={<TaskEditor />} 
                    loader={taskEditorLoader}
                    action={taskEditorAction}
                />
            </Route>
            <Route path="task/calendar" element={<h1>Calendar</h1>} />
            <Route path="task/sticky-wall" element={<h1>Sticky wall</h1>} />
            <Route path="list/:id" element={<ListBody />} />
        </Route>
    </Route>
))
const App = () => {

    const [ userDetails, setUserDetails ] = useState({
        isLoggedIn: true,
        name: "",
        firstName: "",
        lastName: "",
        userId: 12,
        key: ""
    });

    const handleUserDetailsChange = props => {
        setUserDetails(prevUserDetails => {
            return {
                ...prevUserDetails,
                ...props
            }
        })
    }

    window.logout = () => {
        handleUserDetailsChange({isLoggedIn: false});
    }

    
    return (
        <UserContext.Provider value={{
                    userDetails,
                    changeUserDetails: handleUserDetailsChange
                }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <RouterProvider router={routes} />
            </LocalizationProvider>
        </UserContext.Provider>
    )
}

export default App;