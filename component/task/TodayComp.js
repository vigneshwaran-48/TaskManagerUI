import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import TaskBox from "./TaskBox";
import { TaskAPI } from "../../api/TaskAPI";
import { Await, Outlet, defer, useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import 'font-awesome/css/font-awesome.min.css';
import Loading from "../common/Loading";
import { motion } from "framer-motion";
import { Common } from "../../utility/Common";
import { UserContext } from "../../App";


export const todayCompLoader = ({ params }) => {

    return defer({tasksResponse: TaskAPI.getAllTasks()});
}

const TodayComp = () => {

    const navigate = useNavigate();

    const editorRef = useRef(false);

    const urlParams = useParams();

    const [ taskName, setTaskName ] = useState("");

    const location = useLocation();
    
    const tasksLoaderData = useLoaderData();
    
    const userContext = useContext(UserContext);

    const openEditor = id => {
        editorRef.current = true;
        navigate(`${id}/edit`);
    }
    const closeEditor = () => {
        editorRef.current = false;
    }
    
    useEffect(() => {
        const splittedUrl = location.pathname.split("/");
        if(splittedUrl.includes("edit")) {
            openEditor(urlParams.id);
        }
    }, []);

    const onTaskComplete = async (id, event) => {
        const { checked } = event.target;
        await TaskAPI.updateTaskCompleteStatus(id, checked);
    }
    const updateTask = async task => {
        const response = await TaskAPI.updateTask(task);
        if(response === 401) {
            navigate("/login", {replace: true});
        }
        // setTasks(prevTasks => {
        //     if(prevTasks) {
        //         return prevTasks.map(prevTask => {
        //                     if(prevTask.id === task.id) {
        //                         prevTask = task;
        //                     }
        //                     return prevTask;
        //                 });
        //     }
        //     return null;
        // })
    }
    const addTask = async task => {
        task.userId = userContext.userDetails.userId;
        const response = await TaskAPI.addTask(task);
        if(response.status !== 201) {
            Common.showErrorPopup(response.error, 2);
        }
        else {
            Common.showSuccessPopup(response.message, 2);
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
    const renderTasks = taskResponse => {

        if(taskResponse.status !== 200) {
            Common.showErrorPopup("Error while fetching task", 2);
            return;
        }

        const tasks = taskResponse.tasks;

        const taskElements = tasks != null ? tasks.map(task => {
            return (
                <TaskBox 
                    key={task.taskId} 
                    taskDetails={task}
                    onTaskComplete={event => {
                        onTaskComplete(task.taskId, event)
                    }} 
                    openEditor={ openEditor }
                />
            );
        }): tasks;

        return (
            <div className="task-box-wrapper y-axis-flex">
                { taskElements }
            </div>
        );
    }

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            transition={ Common.mainElementsFramerVariants.elemTransition }
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
            <Outlet 
                key={location.pathname} 
                context={{
                updateTask,
                closeEditorStatus: closeEditor,
                isEditorOpened: editorRef.current,
                taskId: urlParams.id
            }} />
        </motion.div>
    )
}

export default TodayComp;