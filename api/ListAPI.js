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
    }
}