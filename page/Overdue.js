import React from 'react'
import { defer } from 'react-router-dom';
import { TaskAPI } from '../api/TaskAPI';

export const overdueLoader = () => {
    return defer({overdueTasks: TaskAPI.getOverdueTasks()});
}
const Overdue = () => {

    
}

export default Overdue;
