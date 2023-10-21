import React, { useContext, useState } from 'react'
import { defer, useLoaderData } from 'react-router-dom';
import { TaskAPI } from '../api/TaskAPI';
import { AppContext } from '../App';
import { Common } from '../utility/Common';
import { motion } from 'framer-motion';
import TaskComp from '../component/task/TaskComp';
import TaskEditor from '../component/task/TaskEditor';

export const overdueLoader = () => {
    return defer({overdueTasks: TaskAPI.getOverdueTasks()});
}
const Overdue = () => {

    const { TaskChangeEvent, updateTask, deleteTask, getTask } = useContext(AppContext);
    const tasksLoaderData = useLoaderData();
    const predicateDate = new Date().toJSON().slice(0, 10);

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

    const todayTaskpredicate = (dueDate, taskDetails) => {
        return  !Common.isDateLesserThan(dueDate, predicateDate) || taskDetails.isCompleted;
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
                taskData={tasksLoaderData.overdueTasks}
                openEditor={openEditor}
                notifyTaskChange={notifyTaskChange}
                id="overdue-tasks-key"
                removeTasksAddInput={true}
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

export default Overdue;
