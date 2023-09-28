import React, { useEffect, useState } from "react";
import ListDropdown from "./ListDropdown";
import Loading from "../common/Loading";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useFetcher } from "react-router-dom";
import { motion } from "framer-motion";
import { Common } from "../../utility/Common";
import { ListAPI } from "../../api/ListAPI";

const TaskEditor = props => {

    const { updateTask, taskId, closeEditorStatus, isOpen, task, deleteTask } = props;
    const [ taskDetails, setTaskDetails ] = useState(task);
    const [ lists, setLists ] = useState([]);

    useEffect(() => {
        setTaskDetails(task);
    }, [task]);

    useEffect(() => {
        fetchLists();
    }, [task]);

    const fetchLists = async () => {
        const response = await ListAPI.getAllListsOfUser();
        if(response.status === 200) {
            setLists(response.lists);
        }
        else {
            Common.showErrorPopup("Error while fetching lists of user");
        }
    }

    const handleChange = event => {
        const { name, value } = event.target;
        setTaskDetails(prevTaskDetails => {
            return {
                ...prevTaskDetails,
                [ name ] : value
            }
        });
    }

    const handleListChange = listDetails => {
        const listToAdd = {
            listName : listDetails.name,
            listId : listDetails.id
        }
        if(taskDetails?.lists) {
            if(!taskDetails.lists.findIndex(list => list.listId === listToAdd.listId)) {
                setTaskDetails(prevTask => {
                    prevTask.lists = [ ...prevTask.lists, listToAdd];
                    return prevTask
                });
            }
            else {
                console.log("Not adding list");
            }
        }
        else {
            setTaskDetails(prevTask => {
                prevTask.lists = [listToAdd]
                return prevTask;
            });
        }
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

    const filterdLists = lists ? lists.map(list => {
        return {
            id: list.listId,
            name: list.listName
        }
    }) : lists;

    const currentLists = taskDetails?.lists ? taskDetails.lists.map(list => {
        return <p key={`current-tasks-lists-${list.listId}`}>{list.listName}</p>
    }) : null;

    console.log(taskDetails);
   
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
                    <div className="task-edit-list-prev-name">
                        { currentLists }
                    </div>
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