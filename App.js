import React, { createContext, useEffect, useRef, useState } from "react";
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
import Overdue, { overdueLoader } from "./page/Overdue";
import AllTasks, { allTasksLoader } from "./page/AllTasks";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { WSEvents } from "./utility/WSEvents";


export const UserContext = createContext();
export const AppContext = createContext();

const routes = createBrowserRouter(createRoutesFromElements(
    <Route path="/">
        <Route element={<WelcomeSharedLayout />}>
            <Route index element={<WelcomeComp />}/>
        </Route>
        <Route path="task" element={<SharedLayout />}
        >
            <Route index element={(() => <Navigate to={"upcoming"} />)()} />
            <Route 
                path="upcoming" 
                element={<UpcomingComp />}
                loader={upcomingTasksLoader}
            />
            <Route 
                path="today" 
                element={<TodayComp />}
                loader={todayCompLoader}
                shouldRevalidate={todayCompShouldRevalidate}
            />
            <Route 
                path="all" 
                element={<AllTasks />}
                loader={allTasksLoader}
            />
            <Route 
                path="overdue" 
                element={<Overdue />}
                loader={overdueLoader}
            />
            <Route path="sticky-wall" element={<h1>Sticky wall</h1>} />
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

    let stompClient;

    useEffect(() => {

        let sockjs = new SockJS("/task-manager");
        stompClient = Stomp.over(sockjs);

        stompClient.connect({}, onConnected);
    }, []);

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

    const onConnected = (frame) => {
        console.log("Connected to task websocket endpoint ...");
        stompClient.subscribe("/user/queue/task", onMessage);
    }

    const onMessage = message => {
        const wsMessage = JSON.parse(message.body);

        switch(wsMessage.event) {
            case WSEvents.CREATE:
                notifyTasksListeners(wsMessage.task, Common.TaskEventConstants.TASK_ADD)
                break;
            case WSEvents.UPDATE:
                notifyTasksListeners(wsMessage.task, Common.TaskEventConstants.TASK_UPDATE);
                break;
            case WSEvents.DELETE:
                notifyTasksListeners(wsMessage.task.taskId, Common.TaskEventConstants.TASK_DELETE);
                break;
            default:
                console.error("Unknown ws event comes from ws message!");
        }
    }

    const notifyTasksListeners = (data, mode) => {
        TaskChangeEvent.current?.forEach(listener => {
            listener.callback(data, mode);
        });
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