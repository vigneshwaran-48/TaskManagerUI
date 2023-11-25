import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Common } from "../../utility/Common";

const getListElem = lists => {
    if(!lists || lists.length < 1) {
        return lists;
    }
    return lists.map(list => {
        return (
                    <div 
                        key={ list.listId }
                        className="task-box-small-container task-box-list x-axis-flex">
                        <div 
                            style={{
                                backgroundColor: list.listColor
                            }}
                            className="tag-list-color-box"
                        ></div>
                        <p>{ list.listName }</p>
                    </div>
                )
        }); 
}
const TaskBox = props => {
    const [ expanded, setExpanded ] = useState(false);
    let { taskDetails } = props;

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));

    const taxBoxStyle = {
        height: expanded ? "40px" : "0px"
    }
    const toggleBottomSection = () => {
        setExpanded(prev => !prev);
    }
    const openEditor = event => {
        event.stopPropagation();
        props.openEditor( taskDetails.taskId );
    }
    const onTaskComplete = event => {
        const { checked } = event;
        props.onTaskComplete(taskDetails.taskId, checked);
    }
    const listElems = getListElem(taskDetails.lists);

    console.log("Rendered TaskBox component ...");

    return (
        <div 
            className={`task-box y-axis-flex ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}`}
            onClick={toggleBottomSection}
        >
            <div className="task-box-top x-axis-flex">
                <input 
                    type="checkbox" 
                    checked={taskDetails.isCompleted} 
                    onClick={event => event.stopPropagation()}
                    onChange={ onTaskComplete }
                />
                <p 
                    className={`task-box-title x-axis-flex ${taskDetails.isCompleted ? "task-completed-text" : ""}`}>
                        {taskDetails?.taskName?.slice(0, 50)}
                </p>
                <span 
                    className="task-editor-open-button"
                    onClick={ openEditor }
                >
                    <i className="fa fa-solid fa-chevron-right"></i>
                </span>
            </div>
            <div 
                className="task-box-bottom x-axis-flex"
                style={taxBoxStyle}
            >
                <div className="task-box-small-container x-axis-flex">
                    <i className="fa fa-solid fa-calendar"></i>
                    <p>{ taskDetails.dueDate }</p>
                </div>
                <div className="task-box-small-container x-axis-flex">
                    <span 
                        className="task-box-sub-count"
                    >
                        { taskDetails.subTasks?.length }
                    </span>
                    <p>{ `Subtasks`}</p>
                </div>
                <div className="task-list-preview x-axis-flex">
                    {listElems}
                </div>
            </div>
        </div>  
    )
}

const listPredicate = (prevLists, currentLists) => {
    if((!prevLists && currentLists) || (prevLists && !currentLists)) {
        return false;
    }
    else {
        if(prevLists.length != currentLists.length) {
            return false;
        }
        else {
            prevLists.forEach(list => {
                const matchedElem = currentLists.find(currentList => currentList.listId === list.listId);
                if(!matchedElem) {
                    return false;
                }
                else if(matchedElem.listName !== list.listName) {
                    return false;
                }
                else if(matchedElem.listColor !== list.listColor) {
                    return false;
                }
            });
            return true;
        }
    }
}

const isEqual = (prevTask, currTask) => {
    const prevTaskDetails = prevTask.taskDetails;
    const currTaskDetails = currTask.taskDetails;

    if(prevTaskDetails.taskId !== currTaskDetails.taskId) {
        return false;
    }
    else if(prevTaskDetails.parentTaskId !== currTaskDetails.parentTaskId) {
        return false;
    }
    else if(prevTaskDetails.taskName !== currTaskDetails.taskName) {
        return false;
    }
    else if(prevTaskDetails.dueDate !== currTaskDetails.dueDate) {
        return false;
    }
    else if(prevTaskDetails.isCompleted !== currTaskDetails.isCompleted) {
        return false;
    }
    else if(prevTaskDetails.description !== currTaskDetails.description) {
        return false;
    }
    else {
        return listPredicate(prevTaskDetails.lists, currTaskDetails.lists);
    }
}

export default memo(TaskBox, isEqual);