import React, { useEffect, useState } from "react";
import ListDropdown from "./ListDropdown";
import Loading from "../common/Loading";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Common } from "../../utility/Common";
import { ListAPI } from "../../api/ListAPI";
import { useSelector } from "react-redux";

const TaskEditor = props => {

    const { updateTask, taskId, closeEditorStatus, isOpen, task, deleteTask } = props;
    const [ taskDetails, setTaskDetails ] = useState(task);
    const [ lists, setLists ] = useState([]);

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));

    useEffect(() => {
        setTaskDetails(task);
    }, [task]);

    useEffect(() => {
        // This condition is for reducing the number of fetch calls.
        if(isOpen || !lists) {
            fetchLists();
        }
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

    const handleListChange = async listDetails => {
        const response = await ListAPI.getListById(listDetails.id);
        if(response.status === 200) {
            checkAndAddList(response.list);
        }
        else {
            Common.showErrorPopup("Error while fetching list");
        }
    }

    const checkAndAddList = listToAdd => {

        if(!listToAdd) return;

        if(taskDetails?.lists) {
            if(taskDetails.lists.findIndex(list => list.listId === listToAdd.listId) < 0) {
                const updatedTask = {
                    ...taskDetails,
                    lists: [ ...taskDetails.lists, listToAdd ]
                }
                setTaskDetails(updatedTask);
            }
        }
        else {
            const updatedTask = {
                ...taskDetails,
                lists: [ listToAdd ]
            }
            setTaskDetails(updatedTask);
        }
    }
    const handleDateChange = newValue => {
        const dateStr = Common.checkAndGiveDoubleDigit(newValue.$y + "") + "-" + 
                        Common.checkAndGiveDoubleDigit((newValue.$M + 1) + "") + "-" +
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
    const handleDeleteList = listId => {
        const deleteFilteredLists = taskDetails.lists.filter(list => list.listId !== listId);
        const updatedTask = { ...taskDetails, lists : deleteFilteredLists};
        setTaskDetails(updatedTask);
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
        return (
            <div 
                key={`current-tasks-lists-${list.listId}`}
                className="task-editor-list-selected-elem x-axis-flex"
                style={{
                    backgroundColor: list.listColor
                }}
            >
                {/* <p>{list.listName.length <= 7 ? list.listName : list.listName.slice(0, 7)}</p> */}
                <p className="x-axis-flex">{list.listName}</p>
                <i onClick={() => handleDeleteList(list.listId)} className="bi bi-x"></i>
            </div>
        )
    }) : null;
   
    return (
        <motion.div 
            className={`task-editor hide-scrollbar y-axis-flex ${isOpen && "show-task-editor"}
                    ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`}
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
                    className="styled-scrollbar"
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
                    <div className="task-edit-list-selected hide-scrollbar x-axis-flex">
                        { currentLists }
                    </div>
                </div>
                <div className="task-edit-date-wrapper x-axis-flex">
                    <p>Due Date</p>
                    <DatePicker 
                        label="DD/MM/YYYY" 
                        value={dayjs(new Date(taskDetails.dueDate))} 
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