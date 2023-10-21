import { Suspense, useContext, useState } from "react";
import { TaskAPI } from "../../api/TaskAPI";
import { Common } from "../../utility/Common";
import NothingToShow from "../../utility/NothingToShow";
import Tasks from "./Tasks";
import Loading from "../common/Loading";
import { Await } from "react-router";
import { UserContext } from "../../App";

const TaskComp = props => {

    const todayNoTaskImage = "/empty.png";

    const { predicate, shouldAwait, taskData, 
            openEditor, notifyTaskChange, id, 
            className, taskCreationDate, listsToBeAddedOnCreation,
            removeTasksAddInput = false } = props;

    const [ taskName, setTaskName ] = useState("");
    
    const userContext = useContext(UserContext);

    const addTask = async task => {
        task.userId = userContext.userDetails.userId;
        task.dueDate = taskCreationDate;

        if(listsToBeAddedOnCreation) {
            task.lists = listsToBeAddedOnCreation;
        }
        const response = await TaskAPI.addTask(task);
        if(response.status !== 201) {
            Common.showErrorPopup(response.error, 2);
        }
        else {
            Common.showSuccessPopup(response.message, 2);
            notifyTaskChange(response.taskId, Common.TaskEventConstants.TASK_ADD, true);
        }
    }
    const handleTaskAddChange = event => {
        const { value } = event.target;
        setTaskName(value);
    }

    const listenForTaskAdd = event => {
        const key = event.key;
        if(key === "Enter") {
            addTask({taskName: taskName})
            setTaskName("");
        }
    }

    const renderTasks = taskResponse => {

        if(taskResponse.status !== 200 && taskResponse.status !== 204) {
            Common.showErrorPopup("Error while fetching task", 2);
            return;
        }

        const tasks = taskResponse.tasks;

        return <Tasks
                    openEditor={openEditor} 
                    tasks={tasks} 
                    predicate={predicate}
                    id={id}
                    fallback={<NothingToShow 
                                img={todayNoTaskImage}
                                message="You don't have any tasks here"
                            />}
                    notifyTaskChange={notifyTaskChange}
                />;   
    }

    return (
        <div className={`today-comp-left hide-scrollbar y-axis-flex ${className || ""}`}>
            {
                !removeTasksAddInput && (
                    <div className="add-task-input-wrapper x-axis-flex">
                        <i className="fa fa-solid fa-plus"></i>
                        <input      
                            type="text" 
                            name="taskName"
                            value={taskName}
                            placeholder="Add New Task"
                            onChange={handleTaskAddChange} 
                            onKeyDown={listenForTaskAdd}
                        />  
                    </div>
                )
            }
            {
                shouldAwait ? (
                    <Suspense fallback={<Loading />}>
                        <Await resolve={taskData}>
                            {renderTasks}
                        </Await>
                    </Suspense>
                )
                : renderTasks(taskData)
            }
            
        </div>
    )
}

export default TaskComp;