import Cookies from "js-cookie";
import { ServerAPIManager } from "../utility/ServerAPIManager";

export const AppAPI = {

    getSideNavbars: async () => {
        const url = ServerAPIManager.ServerURL + 
                    ServerAPIManager.getAppRoutes().utility.sideNav;

        const response = await fetch(url, {redirect: "follow"});

        return await response.json();
    },
    getListSideNav: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().utility.listSideNav;

        const response = await fetch(url, {redirect: "follow"});

        return await response.json();
    },
    logout: async () => {
        const csrfToken = Cookies.get("XSRF-TOKEN");
        const response = await fetch(ServerAPIManager.ServerURL + "/logout", {
                                    method: "POST",
                                    headers: {
                                        "X-XSRF-TOKEN": csrfToken
                                    },
                                    redirect: "follow"
                                });
        return response;
    },
    importData: async formData => {
        const csrfToken = Cookies.get("XSRF-TOKEN");
        const response = await fetch(ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().settings.import, {
                                    method: "POST",
                                    headers: {
                                        "X-XSRF-TOKEN": csrfToken
                                    },
                                    body: formData
                                });
        return await response.json();
    },
    getSettings: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().settings.all;
        const response = await fetch(url);

        return await response.json();
    },
    updateSettings: async (option, value) => {
        const csrfToken = Cookies.get("XSRF-TOKEN");

        let url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().settings.all;
        url += `?settingsOption=${option}&value=${value}`;

        const response = await fetch(url, {
                                    method: "PATCH",
                                    headers: {
                                        "X-XSRF-TOKEN": csrfToken
                                    }
                                });
        return await response.json();
    }
}