import React, { createContext, useRef, useState } from "react";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import WelcomeComp from "./component/public-comp/WelcomeComp";
import WelcomeSharedLayout from "./page/WelomeSharedLayout";
import SharedLayout from "./page/SharedLayout";
import TodayComp, { todayCompLoader, todayCompShouldRevalidate } from "./page/TodayComp";
import ListBody, { listBodyLoader } from "./page/ListBody";
import "./css/index.css";
import UpcomingComp, { upcomingTasksLoader } from "./page/UpcomingComp";
import { TaskAPI } from "./api/TaskAPI";
import { Common } from "./utility/Common";



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
            <Route 
                path="list/:id" 
                element={<ListBody />}
                loader={listBodyLoader}
            />
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

    const updateTask = async (taskToUdpate, notifyTaskChange) => {
        const response = await TaskAPI.updateTask(taskToUdpate);
        const isSuccess = Common.handleNotifyRespone(response);

        if(!isSuccess) return false;

        notifyTaskChange(response.task.taskId, Common.TaskEventConstants.TASK_UPDATE, true);
        return true;
    }

    const deleteTask = async (taskId, notifyTaskChange) => {
        const response = await TaskAPI.deleteTask(taskId);

        const isSuccess = Common.handleNotifyRespone(response);

        if(!isSuccess) return false;

        notifyTaskChange(response.deletedTasks[0], 
                        Common.TaskEventConstants.TASK_DELETE, false);
        return true;
    }

    const getTask = async taskId => {
        const taskResponse = await TaskAPI.getSingleTaskDetails(taskId, 
            userDetails.userId);

        if(taskResponse.status !== 200) {
            Common.showErrorPopup(taskResponse.error, 2);
            return null;
        }
        return taskResponse.task;
    }

    
    return (
        <UserContext.Provider value={{
                    userDetails,
                    changeUserDetails: handleUserDetailsChange
                }}>
            <AppContext.Provider value={{
                    TaskChangeEvent,
                    subscribeToTaskChange,
                    unSubscribeToTaskChange,
                    deleteTask,
                    updateTask,
                    getTask
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <RouterProvider router={routes} />                
                </LocalizationProvider>
            </AppContext.Provider>
        </UserContext.Provider>
    )
}

export default App;