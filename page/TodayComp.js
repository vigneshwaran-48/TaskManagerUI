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

    const settings = JSON.parse(localStorage.getItem("task.settings")).settings;
    
    const sortBy = settings.find(setting => setting.name === Common.SettingsSectionName.SORT).options[0].value;

    return defer({tasksResponse: TaskAPI.getAllTodayTasks(sortBy)});
}

export const todayCompShouldRevalidate = ({ currentUrl }) => {
    return false;
}

const TodayComp = () => {

    const { TaskChangeEvent, updateTask, deleteTask, getTask } = useContext(AppContext);
    const tasksLoaderData = useLoaderData();

    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

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

    const notifyTaskChange = async (data, mode, shouldFetch) => {
        if(shouldFetch) {
            data = await getTask(data);
        }
        if(!data) return;

        TaskChangeEvent.current.forEach(listener => {
            listener.callback(data, mode);
        });
    }

    const todayTaskpredicate = dueDate => {
        const result = Common.isDateLesserThan(new Date().toJSON().slice(0, 10), dueDate);
        if(result === 1) {
            //  Tasks's dueDate is today so no need to remove it from list.
            return false;
        }
        return true;
    }

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle today-comp x-axis-flex"
        >
            <TaskComp 
                predicate={todayTaskpredicate}
                shouldAwait={true}
                taskData={tasksLoaderData.tasksResponse}
                openEditor={openEditor}
                notifyTaskChange={notifyTaskChange}
                id="today-tasks-key"
            />
            <TaskEditor 
                closeEditorStatus={closeEditor} 
                taskId={editorState.taskId}
                isOpen={editorState.isOpen}
                task={editorState.taskDetails}
                updateTask={taskToUdpate =>  updateTask(taskToUdpate, notifyTaskChange)}
                deleteTask={taskId =>  deleteTask(taskId, notifyTaskChange)}
            />
        </motion.div>
    )
}

export default TodayComp;