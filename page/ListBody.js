import React, { useContext, useState } from "react";
import { TaskAPI } from "../api/TaskAPI";
import { useLoaderData, useParams } from "react-router-dom";
import { Common } from "../utility/Common";
import { AppContext } from "../App";
import TaskEditor from "../component/task/TaskEditor";
import TaskComp from "../component/task/TaskComp";
import { motion } from "framer-motion";


export const listBodyLoader = ({ params, request }) => {

    return {listResponse: TaskAPI.getTasksOfList(params.id)};
}
const ListBody = () => {

    const { TaskChangeEvent, updateTask, deleteTask, getTask } = useContext(AppContext);
    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

    const listLoaderData = useLoaderData();

    const params = useParams();

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

    const getDynamicId = () => {
        /**
         * Using this method instead of useParams() because useParams
         * only gives the first rendered component's params only after that it gives 
         * that value for other param routes.
         */
        const splittedPaths = window.location.pathname.split("/");
        return splittedPaths[splittedPaths.length - 1];
    }

    const taskPredicate = (date, taskDetails) => {

        if(taskDetails?.lists && taskDetails.lists.length > 0) {
            const result = taskDetails.lists.some(list => list.listId === parseInt(getDynamicId()));
            return !result;
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
                predicate={taskPredicate}
                shouldAwait={true}
                taskData={listLoaderData.listResponse}
                openEditor={openEditor}
                notifyTaskChange={notifyTaskChange}
                id={`list-tasks-key-${params.id}`}
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

export default ListBody;