import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import { TaskAPI } from "../../api/TaskAPI";
import { Await, defer, 
        useLoaderData, useLocation,
         useParams } from "react-router";
import 'font-awesome/css/font-awesome.min.css';
import Loading from "../common/Loading";
import { motion } from "framer-motion";
import { Common } from "../../utility/Common";
import { UserContext } from "../../App";
import TaskEditor from "./TaskEditor";
import TodayTasks from "./TodayTasks";


export const todayCompLoader = ({ params }) => {

    return defer({tasksResponse: TaskAPI.getAllTodayTasks()});
}

export const todayCompShouldRevalidate = ({ currentUrl }) => {

    console.log(currentUrl);
    return false;
}

const TodayComp = () => {

    //Event for notifying task change
    const TaskChangeEventListeners = useRef([{
        listenerId: "",
        callback: () => {}
    }]);

    const urlParams = useParams();

    const [ taskName, setTaskName ] = useState("");
    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

    const location = useLocation();
    
    const tasksLoaderData = useLoaderData();
    
    const userContext = useContext(UserContext);

    const openEditor = async id => {
        const taskResponse = await TaskAPI.getSingleTaskDetails(id);

        if(taskResponse.status !== 200) {
            Common.showErrorPopup(taskResponse.error, 2);
            return;
        }
        setEditorState({
            isOpen: true,
            taskId: id,
            taskDetails: taskResponse.task
        });
    }
    const closeEditor = () => {
        setEditorState(prev => {
            return {
                ...prev,
                isOpen: false
            }
        });
    }
    
    useEffect(() => {
        const splittedUrl = location.pathname.split("/");
        if(splittedUrl.includes("edit")) {
            openEditor(urlParams.id);
        }
    }, []);

    const addTask = async task => {
        task.userId = userContext.userDetails.userId;
        const response = await TaskAPI.addTask(task);
        if(response.status !== 201) {
            Common.showErrorPopup(response.error, 2);
        }
        else {
            Common.showSuccessPopup(response.message, 2);
            notifyTaskChange(response.taskId, Common.TaskEventConstants.TASK_ADD, true);
        }
    }
    const handleTaskAddChange = event => {
        const { value } = event.target;
        setTaskName(value);
    }

    const listenForTaskAdd = event => {
        const key = event.key;
        if(key === "Enter") {
            addTask({taskName: taskName})
            event.target.value = "";
        }
    }
    const getTask = async taskId => {
        const taskResponse = await TaskAPI.getSingleTaskDetails(taskId, 
            userContext.userDetails.userId);

        if(taskResponse.status !== 200) {
            Common.showErrorPopup(taskResponse.error, 2);
            return null;
        }
        return taskResponse.task;
    }

    const notifyTaskChange = async (data, mode, shouldFetch) => {
        if(shouldFetch) {
            data = await getTask(data);
        }
        if(!data) return;

        TaskChangeEventListeners.current.forEach(listener => {
            listener.callback(data, mode);
        });
    }

    const subscribeToTaskChange = listener => {
        const foundListener = TaskChangeEventListeners.current
                              .find(l => l.listenerId === listener.listenerId);
        if(!foundListener) {
            console.log(TaskChangeEventListeners.current);
            TaskChangeEventListeners.current.push(listener);
            console.log(TaskChangeEventListeners.current);
        }
    }
    const unSubscribeToTaskChange = listenerId => {
        const listeners = TaskChangeEventListeners.current;
        listeners.splice(listeners
                 .findIndex(listener => listener.listenerId === listenerId), 1);
    }

    const updateTask = async taskToUdpate => {
        const response = await TaskAPI.updateTask(taskToUdpate);
        const isSuccess = Common.handleNotifyRespone(response);

        if(!isSuccess) return false;

        notifyTaskChange(response.task.taskId, Common.TaskEventConstants.TASK_UPDATE, true);
        return true;
    }

    const deleteTask = async taskId => {
        const response = await TaskAPI.deleteTask(taskId);

        const isSuccess = Common.handleNotifyRespone(response);

        if(!isSuccess) return false;

        notifyTaskChange(response.deletedTasks[0], Common.TaskEventConstants.TASK_DELETE, false);
        return true;
    }

    const renderTasks = taskResponse => {

        if(taskResponse.status !== 200) {
            Common.showErrorPopup("Error while fetching task", 2);
            return;
        }

        const tasks = taskResponse.tasks;
        return <TodayTasks 
                    openEditor={openEditor} 
                    tasks={tasks} 
                    subscribeTaskEvent={subscribeToTaskChange}
                    unSubscribeTaskEvent={unSubscribeToTaskChange}
                />;   
    }

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle today-comp x-axis-flex"
        > 
            <div className="today-comp-left y-axis-flex">
                <div className="add-task-input-wrapper x-axis-flex">
                    <i className="fa fa-solid fa-plus"></i>
                    <input      
                        type="text" 
                        name="taskName"
                        value={taskName}
                        placeholder="Add New Task"
                        onChange={handleTaskAddChange} 
                        onKeyDown={listenForTaskAdd}
                    />  
                </div>
                <Suspense fallback={<Loading />}>
                    <Await resolve={tasksLoaderData.tasksResponse}>
                        {renderTasks}
                    </Await>
                </Suspense>
            </div>
            
            <TaskEditor 
                closeEditorStatus={closeEditor} 
                taskId={editorState.taskId}
                isOpen={editorState.isOpen}
                task={editorState.taskDetails}
                updateTask={updateTask}
                deleteTask={deleteTask}
            />
            
        </motion.div>
    )
}

export default TodayComp;