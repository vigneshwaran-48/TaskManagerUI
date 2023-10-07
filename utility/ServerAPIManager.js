
let appRoutes = {
    task: {
        all: "/api/v1/task",
        today: "/api/v1/task/today",
        upcoming: "/api/v1/task/upcoming",
        thisWeek: "/api/v1/task/this-week",
        base: "/api/v1/task",
        search: "/api/v1/task/search",
        overdue: "/api/v1/task/overdue"
    },
    utility: {
        sideNav: "/api/v1/utility/side-nav",
        listSideNav: "/api/v1/utility/list-side-nav"
    },
    list: {
        base: "/api/v1/list"
    }
};

export const ServerAPIManager = {

    getAppRoutes: () => {
        // if(!appRoutes || !Object.keys(appRoutes).length) {

        //     const response = await fetch("/api/utility/get-routes");
        //     const data = await response.json();
        //     appRoutes = data;
        // }
        return appRoutes;
    },
    ServerURL: "http://192.168.43.247:8383"
}