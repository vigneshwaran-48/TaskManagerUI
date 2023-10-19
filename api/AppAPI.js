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
    }
}