import { useContext, useEffect, useMemo, useState } from "react";
import { TaskAPI } from "../../api/TaskAPI";
import TaskBox from "./TaskBox";
import { Common } from "../../utility/Common";
import NothingToShow from "../../utility/NothingToShow";
import { AppContext } from "../../App";


const Tasks = props => {

    const { openEditor, predicateDate, id, fallback } = props;
    const [ tasks, setTasks ] = useState(props.tasks);
    const { subscribeToTaskChange, unSubscribeToTaskChange } = useContext(AppContext);

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

        const date = taskDetails.dueDate;
        let comparison = 1;
        if(date) {
            comparison = Common.isDateLesserThan(predicateDate, date);
            console.log(predicateDate)
            console.log(comparison)
        }

        switch(mode) {
            case Common.TaskEventConstants.TASK_UPDATE: 
                if(comparison === true) {
                    deleteTask(taskDetails.taskId);
                    break;
                } 
                setTasks(prevTasks => {
                    return prevTasks.map(task => {
                        if(task.taskId === taskDetails.taskId) {
                            return taskDetails;
                        }
                        return task;
                    });
                });
                break;
            case Common.TaskEventConstants.TASK_ADD:
                
                if(comparison === true) {
                    console.log("Breaking ...")
                    break;
                }
                setTasks(prevTasks => {
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
            const filtered =  prevTasks.filter(task => task.taskId !== id);
            return filtered;
        });
    }

    const onTaskComplete = async (id, checked) => {
        const response = await TaskAPI.updateTaskCompleteStatus(id, checked);
        
        Common.handleNotifyRespone(response);

        setTasks(prevTasks => {
            return prevTasks.map(task => {
                if(task.taskId === id) {
                    task.completed = checked;
                }
                return task;
            });
        });
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
        <div className="task-box-wrapper y-axis-flex">
            { taskElements }
        </div>
    );
};

export default Tasks;