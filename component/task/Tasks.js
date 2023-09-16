import { useEffect, useMemo, useState } from "react";
import { TaskAPI } from "../../api/TaskAPI";
import TaskBox from "./TaskBox";
import { Common } from "../../utility/Common";
import { TaskEventConstants } from "./TodayComp";


const Tasks = props => {

    const { openEditor, subscribeTaskEvent, unSubscribeTaskEvent } = props;
    const [ tasks, setTasks ] = useState(props.tasks);

    useEffect(() => {

        //Subscribing to the task change event
        const listener = {
                            listenerId: "Tasks",
                            callback: taskChangeHandler
                         }
        subscribeTaskEvent(listener);

        return (() => {
                    //Unsubscribing to the task change event
                    unSubscribeTaskEvent("Tasks");
                })
    }, []);

    const taskChangeHandler = (taskDetails, mode) => {
        
        console.log(taskDetails);
        console.log(mode);

        switch(mode) {
            case TaskEventConstants.TASK_UPDATE: 
                setTasks(prevTasks => {
                    return prevTasks.map(task => {
                        if(task.taskId === taskDetails.taskId) {
                            return taskDetails;
                        }
                        return task;
                    });
                });
                break;
            case TaskEventConstants.TASK_ADD:
                setTasks(prevTasks => {
                    return [
                        ...prevTasks,
                        taskDetails
                    ]
                });
                break;
            case TaskEventConstants.TASK_DELETE:
                setTasks(prevTasks => {
                    const filtered =  prevTasks.filter(task => task.taskId !== taskDetails);
                    console.log(filtered);
                    return filtered;
                });
                break;
            default: 
                throw new Error("Unknown task event");
        }
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
        return tasks != null ? tasks.map(task => {
                return (
                    <TaskBox 
                        key={task.taskId} 
                        taskDetails={task}
                        onTaskComplete={onTaskComplete} 
                        openEditor={ openEditor }
                    />
                );
            }): tasks;
    }, [tasks]);


    return (
        <div className="task-box-wrapper y-axis-flex">
            { taskElements }
        </div>
    );
};

export default Tasks;