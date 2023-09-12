import React, { useState } from "react";

const getListElem = list => {
    if(list == null || list.length < 1) {
        return list;
    }
    return (
        <div 
            key={ list.listId }
            className="x-axis-flex">
            <div 
                style={{
                    backgroundColor: list.listColor
                }}
                className="tag-list-color-box"
            ></div>
            <p>{ list.listName }</p>
        </div>
    )
}
const TaskBox = props => {
    const [ expanded, setExpanded ] = useState(false);
    const { taskDetails } = props;
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
    const listElems = getListElem(taskDetails.lists);

    return (
        <div 
            className="task-box y-axis-flex"
            onClick={toggleBottomSection}
        >
            <div className="task-box-top x-axis-flex">
                <input 
                    type="checkbox" 
                    checked={taskDetails.isCompleted} 
                    onClick={event => event.stopPropagation()}
                    onChange={ props.onTaskComplete }
                />
                <p className="task-box-title">{taskDetails?.taskName?.slice(0, 25)}</p>
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
                <div className="x-axis-flex">
                    <i className="fa fa-solid fa-calendar"></i>
                    <p>{ taskDetails.dueDate }</p>
                </div>
                <div className="x-axis-flex">
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

export default TaskBox;