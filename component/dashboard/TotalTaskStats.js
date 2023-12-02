import React from 'react'

const TotalTaskStats = props => {

    const { taskCompleted, tasksPending, tasksOverdue } = props.data;

    return (
        <div className="dashboard-box total-task-stats x-axis-flex">
            <div 
                className="total-tasks-wheel"
                style={{
                    backgroundImage: `conic-gradient(green 0%, 
                                            green ${taskCompleted}%, 
                                            red ${taskCompleted}%, 
                                            red ${taskCompleted + tasksOverdue}%, 
                                            orange ${taskCompleted + tasksOverdue}%, 
                                            orange ${taskCompleted + tasksOverdue + tasksPending}%)`
                }}
            ></div>
            <ul className="wheel-stats-info-container">
                <li className="x-axis-flex"><span className="green"></span> Completed tasks</li>
                <li className="x-axis-flex"><span className="orange"></span> Pending tasks</li>
                <li className="x-axis-flex"><span className="red"></span> Overdue tasks</li>
            </ul>
        </div>
    )
}

export default TotalTaskStats;
