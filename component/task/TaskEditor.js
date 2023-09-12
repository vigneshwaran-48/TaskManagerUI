import React, { Suspense, useState } from "react";
import { 
    Await, defer, redirect,
    useLoaderData, useNavigate, useOutletContext
} from "react-router";
import ListDropdown from "./ListDropdown";
import Loading from "../common/Loading";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Common } from "../../utility/Common";
import { TaskAPI } from "../../api/TaskAPI";
import { useFetcher } from "react-router-dom";

export const taskEditorLoader = ({ params }) => {
    return defer({ singleTaskResponse : TaskAPI.getSingleTaskDetails(params.id, 2) });
}

export const taskEditorAction = async ({ params, request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    if(data.mode === "delete") {
        const response = await TaskAPI.deleteTask(data.taskId);
        if(response.status === 200) {
            Common.showSuccessPopup(response.message, 2);
            return redirect("../?reload=false");
        }
        else {
            Common.showErrorPopup(response.error, 2);
        }
    }
}
const TaskEditor = () => {

    const navigate = useNavigate();
    const { updateTask, taskId, closeEditorStatus } = useOutletContext();
    const [ taskDetails, setTaskDetails ] = useState(null);
    const taskLoaderData = useLoaderData();

    const fetcher = useFetcher();

    const handleChange = event => {
        const { name, value } = event.target;
        setTaskDetails(prevTaskDetails => {
            return {
                ...prevTaskDetails,
                [ name ] : value
            }
        })
    }
    const handleListChange = list => {
        setTaskDetails(prevTask => {
            prevTask.list = list;
            return { ...prevTask };
        })
    }
    const handleDateChange = newValue => {
        const dateStr = newValue.$D + "/" + newValue.$M + "/" + newValue.$y
        setTaskDetails(prevTaskDetails => {
            return {
                ...prevTaskDetails,
                dueDate: dateStr
            }
        })
    }
    const saveChanges = () => {
        updateTask(taskDetails);
        closeEditor();
        closeEditorStatus();
    }
    const handleDeleteTask = () => {
        const data = {
            mode: "delete",
            taskId
        };
        fetcher.submit(data, {method: "delete"});
    }
    const closeEditor = () => {
        closeEditorStatus();
        navigate("../?reload=false");
    }

    const renderEditor = taskResponse => {
        if(taskResponse.status !== 200) {
            Common.showErrorPopup("Error while opening editor!");
            return;
        }
        const taskDetails = taskResponse.task;
        const filterdLists = taskDetails.lists;

        return (
            <div className="editing-section y-axis-flex">
                <h2>Task</h2>
                <input 
                    name="title"
                    value={ taskDetails.taskName }
                    onChange={ handleChange }
                    placeholder="Title"
                />
                <textarea
                    name="description"
                    value={ taskDetails.description }
                    onChange={ handleChange }
                    placeholder="Description"
                ></textarea>
                <div className="task-edit-list-prev x-axis-flex">
                    <p>List</p>
                    <ListDropdown 
                        options={ filterdLists } 
                        onChange={handleListChange}    
                    />
                    <p className="task-edit-list-prev-name">
                        { taskDetails.list?.name }
                    </p>
                </div>
                <div className="task-edit-date-wrapper x-axis-flex">
                    <p>Due Date</p>
                    <DatePicker 
                        label="DD/MM/YYYY" 
                        value={dayjs(taskDetails.dueDate)} 
                        onChange={handleDateChange} 
                        views={["day", "month", "year"]}
                        disablePast 
                    />
                </div>
                <div className="edit-section-buttons-wrapper x-axis-flex">
                    <button 
                        className="common-button delete-task-button"
                        onClick={ handleDeleteTask }
                    >
                        Delete Task
                    </button>
                    <button 
                        className="common-button save-task-changes-button"
                        onClick={ saveChanges }
                    >
                        Save changes
                    </button>
                </div>
            </div>
        );
    }
   
    return (
        <div 
            className="task-editor y-axis-flex"
        >
            <span 
                className="task-editor-close-button"
                onClick={ closeEditor }>
                <i  
                    className="bi bi-x"
                ></i>
            </span>
            <Suspense fallback={<Loading />}>
                <Await resolve={taskLoaderData.singleTaskResponse}>
                    {renderEditor}
                </Await>
            </Suspense>
        </div>
    )
}

export default TaskEditor;