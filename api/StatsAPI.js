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

export const StatsAPI = {

    getTotalTaskStats: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().stats.task;
        return await sendGetRequest(url);
    }
}