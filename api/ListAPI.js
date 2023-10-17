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
            body
        });
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
    }
}