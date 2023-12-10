import { useContext, useEffect, useMemo, useState } from "react";
import { TaskAPI } from "../../api/TaskAPI";
import TaskBox from "./TaskBox";
import { Common } from "../../utility/Common";
import { AppContext } from "../../App";
import { useSelector } from "react-redux";
import { SectionContext } from "../../page/SharedLayout";


const Tasks = props => {

    const { openEditor, predicate, id, fallback, notifyTaskChange } = props;
    const [ tasks, setTasks ] = useState(null);
    const { subscribeToTaskChange, unSubscribeToTaskChange, 
            subscribeToListChange, unSubscribeToListChange } = useContext(AppContext);

    const { section } = useContext(SectionContext);

    const sortBy = useSelector(state => 
        state.settings.find(section => section.name === Common.SettingsSectionName.SORT).options[0].value)

    const shouldGroupTask = useSelector(state => 
        state.settings.find(section => 
            section.name === Common.SettingsSectionName.VIEW).options.find(option => 
                option.name === "groupTasks").value);
    
    const groupTasksBy = useSelector(state => 
        state.settings.find(section => section.name === Common.SettingsSectionName.GROUP_BY).options[0].value);

    const sortGroupBy = useSelector(state => 
        state.settings.find(section => section.name === Common.SettingsSectionName.SORT_GROUP_BY).options[0].value);

    useEffect(() => {
        setTasks(props.tasks);
    }, [props.tasks]);

    useEffect(() => {

        //Subscribing to the task change event
        const listener = {
                            listenerId: id,
                            callback: taskChangeHandler
                         }

        const listListener = {
            listenerId: id + "list-listener",
            callback: listChangeHandler
        }

        subscribeToTaskChange(listener);
        subscribeToListChange(listListener);

        return (() => {
                    //Unsubscribing to the task change event
                    unSubscribeToTaskChange(id);

                    unSubscribeToListChange(id + "list-listener");
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
                        }).sort(Common.getTasksComparator(sortBy));
                    }
                    /**
                     *  Adding the new task, This might happen in Upcoming Task page
                     *  Where if we update today task date to tommorrow or vice versa
                     * */ 
                    return [...prevTasks, taskDetails].sort(Common.getTasksComparator(sortBy));
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
                        return prevTasks.sort(Common.getTasksComparator(sortBy));
                    }

                    return [
                        ...prevTasks,
                        taskDetails
                    ].sort(Common.getTasksComparator(sortBy));
                });
                break;
            case Common.TaskEventConstants.TASK_DELETE:
                deleteTask(taskDetails);
                break;
            default: 
                throw new Error("Unknown task event");
        }
        setTasks(prevTasks => [...prevTasks.sort(Common.getTasksComparator(sortBy))]);
    }

    const listChangeHandler = (listDetails, mode) => {

        switch(mode) {
            
            case Common.ListEventConstants.LIST_UPDATE: 
                setTasks(prevTasks => {
                    const mappedTasks = prevTasks ? prevTasks.map(task => {
                        // Check first the task has list
                        if(task.lists) {
                            // And iterating all lists of the task
                            task.lists = task.lists.map(list => {
                                // If the updated list is found
                                if(list.listId === listDetails.listId) {
                                    // Return new updated list
                                    return listDetails;
                                }
                                // Otherwise return the existing one
                                return list;
                            });
                        }
                        return task;
                    }) : prevTasks;
                    return mappedTasks;
                });
                break;
            case Common.ListEventConstants.LIST_DELETE:
                setTasks(prevTasks => {
                    const mappedTasks = prevTasks ? prevTasks.map(task => {
                        // Check first the task has list
                        console.log(task);
                        if(task.lists) {
                            console.log("Editing lists of task");
                            task.lists = task.lists.filter(list => list.listId !== listDetails);
                        }
                        return task;
                    }) : prevTasks;

                    return mappedTasks;
                });
                break;
            default:
                // Ignoring other events
        }
    }

    const deleteTask = id => {
        setTasks(prevTasks => {
            if(prevTasks == null) prevTasks = [];
            const filtered =  prevTasks.filter(task => task.taskId !== id);
            filtered.sort(Common.getTasksComparator(sortBy));
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
        const groupVsTasks = {};
        
        if(shouldGroupTask && section !== "Upcoming") {
            if(tasks != null && tasks.length > 0) {
                tasks.forEach(task => {
                    const date = Common.getDateFromServerTime(task[groupTasksBy]);
                    let tasksInGroup = groupVsTasks[date];
                    if(!tasksInGroup) {
                        groupVsTasks[date] = [];
                        tasksInGroup = groupVsTasks[date];
                    }
                    tasksInGroup.push(<TaskBox 
                        key={task.taskId} 
                        taskDetails={task}
                        onTaskComplete={onTaskComplete} 
                        openEditor={ openEditor }
                    />)
                });
                const groupTasks = [];
                const keys = Object.keys(groupVsTasks);
                keys.sort((a, b) => {
                    const dateA = new Date(a);
                    const dateB = new Date(b);
                    if(dateA < dateB) {
                        return -1;
                    }
                    else if(dateA > dateB) {
                        return 1;
                    }
                    return 0;
                });

                if(sortGroupBy === Common.GroupSortOptions.DESCENDING) {
                    // Sorting in descending order
                    keys.reverse();
                }

                keys.forEach(key => {
                    groupVsTasks[key].sort(Common.getTasksComparator(sortBy));
                    groupTasks.push(
                        <TasksGroup 
                            key={key}
                            groupName={key} 
                            tasksElems={groupVsTasks[key]}
                        />)
                });
                
                return groupTasks;
            }
            else {
                return fallback;
            }
        }
        else {
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
        }
        
    }, [tasks]);

    return (
        <div className="task-box-wrapper hide-scrollbar y-axis-flex">
            { taskElements }
        </div>
    );
};

const TasksGroup = props => {

    const { groupName, tasksElems } = props;

    return (
        <div className="tasks-group-container">
            <p>{ groupName }</p>
            <div className="tasks-group">
                <div className="tasks-group-side-line"></div>
                {tasksElems}
            </div>
        </div>
    )
}

export default Tasks;