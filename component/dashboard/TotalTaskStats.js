import React from 'react'

const TotalTaskStats = () => {

    const completedTasks = 40;
    const overdue = 50;
    const pending = 10;

    return (
        <div className="dashboard-box total-task-stats x-axis-flex">
            <div 
                className="total-tasks-wheel"
                style={{
                    backgroundImage: `conic-gradient(green 0%, 
                                            green ${completedTasks}%, 
                                            red ${completedTasks}%, 
                                            red ${completedTasks + overdue}%, 
                                            orange ${completedTasks + overdue}%, 
                                            orange ${completedTasks + overdue + pending}%)`
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
