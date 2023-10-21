import React, { useContext, useState } from 'react'
import { defer, useLoaderData } from 'react-router-dom'
import { TaskAPI } from '../api/TaskAPI'
import { motion } from 'framer-motion'
import TaskComp from '../component/task/TaskComp'
import TaskEditor from '../component/task/TaskEditor'
import { AppContext } from '../App'
import { Common } from '../utility/Common'
import Dropdown from '../utility/Dropdown'
import "../css/allcomp.css";


export const allTasksLoader = () => {
    return defer({allTasks: TaskAPI.getAllTasks()});
}
const AllTasks = () => {

    const allTasksLoader = useLoaderData();

    const { TaskChangeEvent, updateTask, deleteTask, getTask } = useContext(AppContext);

    const [ editorState, setEditorState ] = useState({
        isOpen: false,
        taskId: -1,
        taskDetails: null
    });

    const filterMenus = [
        {
            id: 1,
            name: "Completed"
        },
        {
            id: 2,
            name: "Yet to finish"
        },
        {
            id: 3,
            name: "List",
            subItems: [
                {
                    id: 1,
                    name: 'Work'
                },
                {
                    id: 2,
                    name: "Personal",
                    subItems: [
                        {
                            id: 1,
                            name: "Testing"
                        }
                    ]
                }
            ]
        }
    ]

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

    const allTasksPredicate = () => {
        return false;
    }

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle today-comp x-axis-flex"
        >
            <div className="task-comp-and-filter-wrapper y-axis-flex">
                <div className="task-listing-filters x-axis-flex" tabIndex={0}>
                    <div className="task-filter-options-container y-axis-flex">
                        <i className="fa fa-solid fa-filter"></i>
                        <Dropdown items={filterMenus} isOpen={true} />
                    </div>
                </div>
                <TaskComp 
                    predicate={allTasksPredicate}
                    shouldAwait={true}
                    taskData={allTasksLoader.allTasks}
                    openEditor={openEditor}
                    notifyTaskChange={notifyTaskChange}
                    id="all-tasks-key"
                    removeTasksAddInput={true}
                />
            </div>
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

export default AllTasks;
