import React, { useContext, useEffect, useState } from "react";
import { TaskAPI } from "../api/TaskAPI";
import { defer, useLoaderData, useLocation, useParams} from "react-router";
import 'font-awesome/css/font-awesome.min.css';
import "../css/utility.css";
import TaskComp from "../component/task/TaskComp";
import { motion } from "framer-motion";
import { Common } from "../utility/Common";
import TaskEditor from "../component/task/TaskEditor";
import { AppContext, UserContext } from "../App";

export const todayCompLoader = ({ request, params }) => {

    return defer({tasksResponse: TaskAPI.getAllTodayTasks()});
}

export const todayCompShouldRevalidate = ({ currentUrl }) => {
    return false;
}

const TodayComp = () => {

    const { TaskChangeEvent } = useContext(AppContext);
    const userContext = useContext(UserContext);
    const tasksLoaderData = useLoaderData();
    const predicateDate = new Date().toJSON().slice(0, 10);

    const location = useLocation();

    const urlParams = useParams();

    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

    useEffect(() => {
        const splittedUrl = location.pathname.split("/");
        if(splittedUrl.includes("edit")) {
            openEditor(urlParams.id);
        }
    }, []);

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

        notifyTaskChange(response.deletedTasks[0], 
                        Common.TaskEventConstants.TASK_DELETE, false);
        return true;
    }

    const notifyTaskChange = async (data, mode, shouldFetch) => {
        if(shouldFetch) {
            data = await getTask(data);
        }
        if(!data) return;

        TaskChangeEvent.current.forEach(listener => {
            listener.callback(data, mode);
        });
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

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle today-comp x-axis-flex"
        >
            <TaskComp 
                predicateDate={predicateDate} 
                shouldAwait={true}
                taskData={tasksLoaderData.tasksResponse}
                openEditor={openEditor}
                notifyTaskChange={notifyTaskChange}
            />
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