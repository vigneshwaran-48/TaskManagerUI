import React, { useEffect, useState } from "react";
import ListDropdown from "./ListDropdown";
import Loading from "../common/Loading";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useFetcher } from "react-router-dom";
import { motion } from "framer-motion";
import { Common } from "../../utility/Common";

const TaskEditor = props => {

    const { updateTask, taskId, closeEditorStatus, isOpen, task, deleteTask } = props;
    const [ taskDetails, setTaskDetails ] = useState(task);

    const fetcher = useFetcher();

    useEffect(() => {
        setTaskDetails(task);
    }, [task]);

    const handleChange = event => {
        const { name, value } = event.target;
        setTaskDetails(prevTaskDetails => {
            return {
                ...prevTaskDetails,
                [ name ] : value
            }
        });
    }

    const handleListChange = list => {
        setTaskDetails(prevTask => {
            prevTask.list = list;
            return { ...prevTask };
        })
    }
    const handleDateChange = newValue => {
        const dateStr = Common.checkAndGiveDoubleDigit(newValue.$y + "") + "-" + 
                        Common.checkAndGiveDoubleDigit(newValue.$M + "") + "-" +
                        Common.checkAndGiveDoubleDigit(newValue.$D + "");
        setTaskDetails(prevTaskDetails => {
            return {
                ...prevTaskDetails,
                dueDate: dateStr
            }
        })
    }
    const saveChanges = async () => {
        if(await updateTask(taskDetails)) {
            closeEditor();
        }
    }
    const handleDeleteTask = async () => {
        if(deleteTask(taskDetails.taskId)) {
            closeEditor();
        }
    }
    const closeEditor = () => {
        closeEditorStatus();
    }

    const filterdLists = taskDetails?.lists;
   
    return (
        <motion.div 
            className={`task-editor y-axis-flex ${isOpen && "show-task-editor"}`}
        >
            <span 
                style={{
                    display: `${isOpen ? "block" : "none"}`
                }}
                className="task-editor-close-button"
                onClick={ closeEditor }>
                <i  
                    className="bi bi-x"
                ></i>
            </span>
            {
                taskDetails ? (
                <div className="editing-section y-axis-flex">
                <h2>Task</h2>
                <input 
                    name="taskName"
                    value={ taskDetails.taskName }
                    onChange={ handleChange }
                    placeholder="Title"
                />
                <textarea
                    name="description"
                    value={ taskDetails.description || "" }
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
                        Save Changes
                    </button>
                </div>
                </div>
                ) 
                : <Loading />
            } 
        </motion.div>
    )
}

export default TaskEditor;