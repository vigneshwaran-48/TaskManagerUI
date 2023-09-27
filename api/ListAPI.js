import { ServerAPIManager } from "../utility/ServerAPIManager"

export const ListAPI = {

    addList: async listDetails => {

        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().list.base;
        const response = await fetch(url, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(listDetails)
                                });
        return await response.json();
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