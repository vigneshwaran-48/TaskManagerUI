import { defer, useLoaderData } from "react-router-dom";
import { TaskAPI } from "../api/TaskAPI";
import { Common } from "../utility/Common";
import { motion } from "framer-motion";
import TaskComp from "../component/task/TaskComp";
import { useContext, useState } from "react";
import TaskEditor from "../component/task/TaskEditor";
import { AppContext } from "../App";

export const upcomingTasksLoader = () => {
    return defer({
        upcomingTasksResponse: TaskAPI.getUpcomingTasks(),
        todayTasksResponse: TaskAPI.getAllTodayTasks(),
        thisWeekTasksResponse: TaskAPI.getThisWeekTasks()
    });
}
const UpcomingComp = () => {

    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

    const app = useContext(AppContext);

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
            data = await app.getTask(data);
        }
        if(!data) return;

        app.TaskChangeEvent.current.forEach(listener => {
            listener.callback(data, mode);
        });
    }

    const upcomingTasksLoaderData = useLoaderData();

    const todayTaskpredicate = dueDate => {
        const result = Common.isDateLesserThan(new Date().toJSON().slice(0, 10), dueDate);
        return result !== 1;
    }

    const tomorrowTaskPredicate = dueDate => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        console.log(tomorrow.toJSON().slice(0, 10));
        const result = Common.isDateLesserThan(tomorrow.toJSON().slice(0, 10), dueDate);

        return result !== 1;
    }
    const weekTaskPredicate = dueDate => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        console.log(tomorrow.toJSON().slice(0, 10));
        const result = Common.isDateLesserThan(tomorrow.toJSON().slice(0, 10), dueDate);

        return result;
    }

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle upcoming-tasks-comp x-axis-flex"
        >
            <div className="upcoming-tasks-container-wrapper y-axis-flex">
                <div className="upcoming-tasks-container">
                    <h2>Today</h2>
                    <TaskComp 
                        predicate={todayTaskpredicate} 
                        shouldAwait={true}
                        taskData={upcomingTasksLoaderData.todayTasksResponse}
                        openEditor={openEditor}
                        notifyTaskChange={notifyTaskChange}
                        id="upcoming-tasks-today-key"
                        className="upcoming-task-comp"
                    />
                </div>

                <div className="upcoming-tasks-container">
                    <h2>Tomorrow</h2>
                    <TaskComp 
                        predicate={tomorrowTaskPredicate} 
                        shouldAwait={true}
                        taskData={upcomingTasksLoaderData.upcomingTasksResponse}
                        openEditor={openEditor}
                        notifyTaskChange={notifyTaskChange}
                        id="upcoming-tasks-tomorrow-key"
                        className="upcoming-task-comp"
                    />
                </div>

                <div className="upcoming-tasks-container">
                    <h2>This Week</h2>
                    <TaskComp 
                        predicate={weekTaskPredicate} 
                        shouldAwait={true}
                        taskData={upcomingTasksLoaderData.thisWeekTasksResponse}
                        openEditor={openEditor}
                        notifyTaskChange={notifyTaskChange}
                        id="upcoming-tasks-week-key"
                        className="upcoming-task-comp"
                    />
                </div>
            </div>
            <TaskEditor 
                closeEditorStatus={closeEditor} 
                taskId={editorState.taskId}
                isOpen={editorState.isOpen}
                task={editorState.taskDetails}
                updateTask={taskToUdpate =>app.updateTask(taskToUdpate, notifyTaskChange)}
                deleteTask={taskId => app.deleteTask(taskId, notifyTaskChange)}
            />
        </motion.div>
    )

}

export default UpcomingComp;