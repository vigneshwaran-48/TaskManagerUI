import React, { createContext, useRef, useState } from "react";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import WelcomeComp from "./component/public-comp/WelcomeComp";
import WelcomeSharedLayout from "./page/WelomeSharedLayout";
import SharedLayout from "./page/SharedLayout";
import TodayComp, { todayCompLoader, todayCompShouldRevalidate } from "./page/TodayComp";
import ListBody from "./component/ListBody";
import "./css/index.css";
import UpcomingComp, { upcomingTasksLoader } from "./page/UpcomingComp";



export const UserContext = createContext();
export const AppContext = createContext();

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
            <Route 
                path="task/upcoming" 
                element={<UpcomingComp />}
                loader={upcomingTasksLoader}
            />
            <Route 
                path="task/today" 
                element={<TodayComp />}
                loader={todayCompLoader}
                shouldRevalidate={todayCompShouldRevalidate}
            />
            <Route path="task/calendar" element={<h1>Calendar</h1>} />
            <Route path="task/sticky-wall" element={<h1>Sticky wall</h1>} />
            <Route path="list/:id" element={<ListBody />} />
        </Route>
    </Route>
))
const App = () => {

    //Event for notifying task change
    const TaskChangeEvent = useRef([{
        listenerId: "",
        callback: () => {}
    }]);

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
    
    const subscribeToTaskChange = listener => {
        const foundListener = TaskChangeEvent.current
                              .find(l => l.listenerId === listener.listenerId);
        if(!foundListener) {
            TaskChangeEvent.current.push(listener);
        }
    }
    const unSubscribeToTaskChange = listenerId => {
        const listeners = TaskChangeEvent.current;
        listeners.splice(listeners
                 .findIndex(listener => listener.listenerId === listenerId), 1);
    }

    window.logout = () => {
        handleUserDetailsChange({isLoggedIn: false});
    }

    
    return (
        <UserContext.Provider value={{
                    userDetails,
                    changeUserDetails: handleUserDetailsChange
                }}>
            <AppContext.Provider value={{
                    TaskChangeEvent,
                    subscribeToTaskChange,
                    unSubscribeToTaskChange
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <RouterProvider router={routes} />                
                </LocalizationProvider>
            </AppContext.Provider>
        </UserContext.Provider>
    )
}

export default App;