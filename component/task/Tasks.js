import { useContext, useEffect, useMemo, useState } from "react";
import { TaskAPI } from "../../api/TaskAPI";
import TaskBox from "./TaskBox";
import { Common } from "../../utility/Common";
import NothingToShow from "../../utility/NothingToShow";
import { AppContext } from "../../App";


const Tasks = props => {

    const { openEditor, predicate, id, fallback, notifyTaskChange } = props;
    const [ tasks, setTasks ] = useState(null);
    const { subscribeToTaskChange, unSubscribeToTaskChange } = useContext(AppContext);

    useEffect(() => {
        setTasks(props.tasks);
    }, [props.tasks]);

    useEffect(() => {

        //Subscribing to the task change event
        const listener = {
                            listenerId: id,
                            callback: taskChangeHandler
                         }
        subscribeToTaskChange(listener);

        return (() => {
                    //Unsubscribing to the task change event
                    unSubscribeToTaskChange(id);
                })
    }, []);

    const taskChangeHandler = (taskDetails, mode) => {

        if(!taskDetails) return;

        const date = taskDetails.dueDate;
        let removeFromList = false;
        if(date) {
            removeFromList = predicate(date, taskDetails);
        }

        switch(mode) {
            case Common.TaskEventConstants.TASK_UPDATE: 
                if(removeFromList) {
                    deleteTask(taskDetails.taskId);
                    break;
                } 
                setTasks(prevTasks => {
                    const index = prevTasks.findIndex(task => task.taskId === taskDetails.taskId);
                    if(index >= 0) {
                        // Updating the existing task
                        return prevTasks.map(task => {
                            if(task.taskId === taskDetails.taskId) {
                                return taskDetails;
                            }
                            return task;
                        });
                    }
                    /**
                     *  Adding the new task, This might happen in Upcoming Task page
                     *  Where if we update today task date to tommorrow or vice versa
                     * */ 
                    return [...prevTasks, taskDetails];
                });
                break;
            case Common.TaskEventConstants.TASK_ADD:
                
                if(removeFromList) {
                    break;
                }
                
                setTasks(prevTasks => {
                    if(prevTasks == null) prevTasks = [];

                    if(prevTasks && prevTasks.findIndex(task => task.taskId === taskDetails.taskId) >= 0) {
                        console.log("Duplicate task came for an TASK_ADD event!, Maybe the websocket doing this.");
                        return prevTasks;
                    }

                    return [
                        ...prevTasks,
                        taskDetails
                    ]
                });
                break;
            case Common.TaskEventConstants.TASK_DELETE:
                deleteTask(taskDetails);
                break;
            default: 
                throw new Error("Unknown task event");
        }
    }

    const deleteTask = id => {
        setTasks(prevTasks => {
            if(prevTasks == null) prevTasks = [];
            const filtered =  prevTasks.filter(task => task.taskId !== id);
            return filtered;
        });
    }

    const onTaskComplete = async (id, checked) => {
        const response = await TaskAPI.updateTaskCompleteStatus(id, checked);
        
        Common.handleNotifyRespone(response);

        notifyTaskChange(id, Common.TaskEventConstants.TASK_UPDATE, true);

    }

    //Using useMemo here beacuse in the parent componenet whenever a word is changed
    //in input this all componenets starts re render. But now it wont re-render until 
    //the tasks changes.
    const taskElements = useMemo(() => {
        return tasks != null && tasks.length > 0 ? tasks.map(task => {
                return (
                    <TaskBox 
                        key={task.taskId} 
                        taskDetails={task}
                        onTaskComplete={onTaskComplete} 
                        openEditor={ openEditor }
                    />
                );
            }): fallback
    }, [tasks]);


    return (
        <div className="task-box-wrapper hide-scrollbar y-axis-flex">
            { taskElements }
        </div>
    );
};

export default Tasks;