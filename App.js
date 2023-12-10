import React, { createContext, useEffect, useRef, useState } from "react";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SharedLayout, { appLoader } from "./page/SharedLayout";
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
import Settings from "./page/Settings";
import General from "./component/setting/General";
import ImportExport from "./component/setting/ImportExport";
import { store } from "./store";
import Dashboard, { dashboardLoader } from "./page/Dashboard";
import ErrorComp from "./utility/ErrorComp";


export const UserContext = createContext();
export const AppContext = createContext();

const routes = createBrowserRouter(createRoutesFromElements(
    <Route 
        path="/" 
        errorElement={<ErrorComp />}
    >
        <Route index element={(() => <Navigate to={"task"} />)()} />
        <Route 
            path="task" 
            element={<SharedLayout />}
            loader={appLoader}
        >
            {/* This index route is to change the route in the url field to upcoming, otherwise only the Upcoming component
                will render but the url won't change.
            */}
            <Route index element={(() => <Navigate to={"upcoming"} />)()}  />

            <Route 
                path="dashboard" 
                element={<Dashboard />}
                loader={dashboardLoader}
            />
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
            <Route 
                path="list/:id" 
                element={<ListBody />}
                loader={listBodyLoader}
            />
            <Route path="settings" element={<Settings />}>
                <Route 
                    index 
                    element={(() => <Navigate to="general" />)()} />
                <Route 
                    path="general" 
                    element={<General />} />
                <Route 
                    path="import-export" 
                    element={<ImportExport />} />
            </Route>
        </Route>
    </Route>
))
const App = () => {

    //Event for notifying task change
    const TaskChangeEvent = useRef([{
        listenerId: "",
        callback: () => {}
    }]);

    //Event for notifying list change
    const ListChangeEvent = useRef([{
        listenerId: "",
        callback: () => {}
    }])

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

    const subscribeToListChange = listener => {
        const foundListener = ListChangeEvent.current
                              .find(l => l.listenerId === listener.listenerId);
        if(!foundListener) {
            ListChangeEvent.current.push(listener);
        }
    }
    const unSubscribeToListChange = listenerId => {
        const listeners = ListChangeEvent.current;
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
        console.log("Connected to websocket endpoint ...");
        stompClient.subscribe("/user/personal/task", onTaskMessage);
        stompClient.subscribe("/user/personal/list", onListMessage);
    }

    const onTaskMessage = message => {
        triggerWSEvent(message, true);
    }

    const onListMessage = message => {
        triggerWSEvent(message, false);
    }

    const triggerWSEvent = (message, isTask) => {
        const wsMessage = JSON.parse(message.body);

        switch(wsMessage.event) {
            case WSEvents.CREATE:
                if(isTask) {
                    notifyTasksListeners(wsMessage.task, Common.TaskEventConstants.TASK_ADD)
                    break;
                }
                notifyListListeners(wsMessage.list, Common.ListEventConstants.LIST_ADD);
                break;
            case WSEvents.UPDATE:
                if(isTask) {
                    notifyTasksListeners(wsMessage.task, Common.TaskEventConstants.TASK_UPDATE);
                    break;
                }
                notifyListListeners(wsMessage.list, Common.ListEventConstants.LIST_UPDATE);
                break;
            case WSEvents.DELETE:
                if(isTask) {
                    notifyTasksListeners(wsMessage.task.taskId, Common.TaskEventConstants.TASK_DELETE);
                    break;
                }
                notifyListListeners(wsMessage.list.listId, Common.ListEventConstants.LIST_DELETE);
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

    const notifyListListeners = (data, mode) => {
        ListChangeEvent.current?.forEach(listener => {
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
                    ListChangeEvent,
                    subscribeToTaskChange,
                    unSubscribeToTaskChange,
                    subscribeToListChange,
                    unSubscribeToListChange,
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