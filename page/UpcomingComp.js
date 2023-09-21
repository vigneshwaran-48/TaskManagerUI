import { defer, useLoaderData } from "react-router-dom";
import { TaskAPI } from "../api/TaskAPI";
import { Common } from "../utility/Common";
import { motion } from "framer-motion";
import TaskComp from "../component/task/TaskComp";
import { useState } from "react";


export const upcomingTasksLoader = () => {
    return defer({
        upcomingTasksResponse: TaskAPI.getUpcomingTasks(),
        todayTasksResponse: TaskAPI.getAllTodayTasks()
    });
}
const UpcomingComp = () => {

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
        console.log("Task changed in upcomgin tasks componenet ...");
    }

    const upcomingTasksLoaderData = useLoaderData();

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle upcoming-tasks-comp y-axis-flex"
        >
            <div className="upcoming-tasks-container">
                <h2>Today</h2>
                <TaskComp 
                    predicateDate={new Date().toJSON().slice(0, 10)} 
                    shouldAwait={true}
                    taskData={upcomingTasksLoaderData.todayTasksResponse}
                    openEditor={openEditor}
                    notifyTaskChange={notifyTaskChange}
                />
            </div>

            <div className="upcoming-tasks-container">
                <h2>Tomorrow</h2>
                <TaskComp 
                    predicateDate={new Date().toJSON().slice(0, 10)} 
                    shouldAwait={true}
                    taskData={upcomingTasksLoaderData.upcomingTasksResponse}
                    openEditor={openEditor}
                    notifyTaskChange={notifyTaskChange}
                />
            </div>
        </motion.div>
    )

}

export default UpcomingComp;