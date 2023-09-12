
let appRoutes = {
    task: {
        all: "/api/v1/task",
        base: "/api/v1/task"
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
    ServerURL: "http://localhost:8383"
}