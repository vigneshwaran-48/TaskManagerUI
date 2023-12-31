import Cookies from "js-cookie";
import { ServerAPIManager } from "../utility/ServerAPIManager";

const sendGetRequest = async url => {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        },
    });
    if(response.redirected) {
        window.location.href = response.url;
    }
    return await response.json();
}
const sendRequestWithCsrf = async (url, method, includeBody, body) => {
    const csrfToken = Cookies.get("XSRF-TOKEN");
    if(includeBody) {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            },
            body,
            redirect: "follow"
        });
        if(response.redirected) {
            window.location.href = response.url;
        }
        return await response.json();
    }
    else {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            }
        });
        if(response.redirected) {
            window.location.href = response.url;
        }
        return await response.json();
    }
}
export const TaskAPI = {

    
    getAllTasks: async sortBy => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.all + "?sortBy=" + sortBy;
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    getAllTodayTasks: async sortBy => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.today + `?sortBy=${sortBy}`;

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
        return await sendRequestWithCsrf(url, "PATCH", false);
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
    updateTask: async (task, userId) => {
        const urlParams = new URLSearchParams();
        urlParams.set("removeListNotIncluded", true);

        const url = ServerAPIManager.ServerURL 
                    + ServerAPIManager.getAppRoutes().task.base + "/" + task.taskId
                    + "?" + urlParams.toString();

        return await sendRequestWithCsrf(url, "PATCH", true, JSON.stringify(task));
    },
    deleteTask: async id => {
        const url = ServerAPIManager.ServerURL 
                    + ServerAPIManager.getAppRoutes().task.base + "/" + id;
        return await sendRequestWithCsrf(url, "DELETE", false);
    },
    addTask: async task => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.base;
        return await sendRequestWithCsrf(url, "POST", true, JSON.stringify(task));
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
    getThisWeekTasks: async sortBy => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.thisWeek + `?sortBy=${sortBy}`;

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    },
    getTasksByDate: async (dueDate, sortBy) => {
        const urlParams = new URLSearchParams();
        urlParams.set("dueDate", dueDate);
        urlParams.set("sortBy", sortBy);

        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.base + "?" + urlParams.toString();
        
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    getTasksOfList: async (listId, sortBy) => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.base + "/list/" + listId 
                    + `?sortBy=${sortBy}`;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    },
    getOverdueTasks: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().task.overdue;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json(); 
    },
    getTasksWithName: async taskName => {

        const urlParams = new URLSearchParams();
        urlParams.set("taskName", taskName);

        const url = `${ServerAPIManager.ServerURL}${ServerAPIManager.getAppRoutes().task.search}?${urlParams.toString()}`;
        return await sendGetRequest(url);
    }
}