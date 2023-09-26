import { ServerAPIManager } from "../utility/ServerAPIManager";

export const AppAPI = {

    getSideNavbars: async () => {
        const url = ServerAPIManager.ServerURL + 
                    ServerAPIManager.getAppRoutes().utility.sideNav;

        const response = await fetch(url);

        return await response.json();
    },
    getListSideNav: async () => {
        const url = ServerAPIManager.ServerURL + ServerAPIManager.getAppRoutes().utility.listSideNav;

        const response = await fetch(url);

        return await response.json();
    }
}