import Cookies from "js-cookie";
import { ServerAPIManager } from "../utility/ServerAPIManager"

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
            },
            redirect: "follow"
        });
        if(response.redirected) {
            window.location.href = response.url;
        }
        return await response.json();
    }
}

export const ListAPI = {

    addList: async listDetails => {

        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().list.base;

        return await sendRequestWithCsrf(url, "POST", true, JSON.stringify(listDetails));
    },
    getListById: async listId => {

        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().list.base + "/" + listId;
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    getAllListsOfUser: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().list.base
        const response = await fetch(url, {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
        return await response.json();
    },
    deleteList: async id => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().list.base + "/" + id;
        return await sendRequestWithCsrf(url, "DELETE", false);
    }
}