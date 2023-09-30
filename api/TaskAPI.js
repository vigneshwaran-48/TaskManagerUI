import { ServerAPIManager } from "../utility/ServerAPIManager";

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
    getAllTodayTasks: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.today;
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    updateTaskCompleteStatus: async (taskId) => {

        const url = ServerAPIManager.ServerURL 
                    + ServerAPIManager.getAppRoutes().task.base 
                    + "/" + taskId + "/toggle";
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }                        
        });
        return await response.json();
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
        const urlParams = new URLSearchParams();
        urlParams.set("removeListNotIncluded", true);

        const url = ServerAPIManager.ServerURL 
                    + ServerAPIManager.getAppRoutes().task.base + "/" + task.taskId
                    + "?" + urlParams.toString();

        const response = await fetch(url, {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(task)
                                });
        return await response.json();
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
    },
    getUpcomingTasks: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.upcoming;
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    getThisWeekTasks: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.thisWeek;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    },
    getTasksByDate: async dueDate => {
        const urlParams = new URLSearchParams();
        urlParams.set("dueDate", dueDate);

        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.base + "?" + urlParams.toString();
        
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    getTasksOfList: async listId => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.base + "/list/" + listId;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    }
}