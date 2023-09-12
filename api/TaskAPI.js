import { ServerAPIManager } from "../utility/ServerAPIManager";

let tasks = [
    {
        id: 10004,
        title: "Task 1",
        description: "First Task",
        list: {
            id: 8980,
            name: "Personal",
            color: "red"
        },
        dueDate: "12/09/2022",
        tags: [],
        subTasks: [],
        isCompleted: false
    },
    {
        id: 10005,
        title: "Task 2",
        description: "Second task",
        lists: [],
        dueDate: "28/09/2024",
        tags: [],
        subTasks: [],
        isCompleted: true
    }
];

let lists = [

    {
        id: 8980,
        name: "Personal",
        color: "red"
    },
    {
        id: 9008,
        name: "Work",
        color: "teal"
    }
]

export const TaskAPI = {

    
    getAllTasks: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.all;
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    updateTaskCompleteStatus: async (taskId, status) => {

        tasks = tasks.map(task => {
            if(task.id === taskId) {
                task.isCompleted = status;
            }
            return task;
        })
    },
    getSingleTaskDetails: async (id, userId) => {
        const url = ServerAPIManager.ServerURL 
                    + ServerAPIManager.getAppRoutes().task.base 
                    + "/" + id;
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }                        
                                });
        return await response.json();
    },
    getLists: async userId => {
        return lists;
    },
    updateTask: async (task, userId) => {
        tasks = tasks.map(prevTask => {
            if(prevTask.id === task.id) {
                prevTask = task;
            }
            return prevTask;
        });
        return 200;
    },
    deleteTask: async id => {
        const url = ServerAPIManager.ServerURL 
                    + ServerAPIManager.getAppRoutes().task.base + "/" + id;

        const response = await fetch(url, {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json"
                                    }  
                                });
        return await response.json();
    },
    addTask: async task => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.base;
        const response = await fetch(url, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(task)
                                });
        return await response.json();
    }
}