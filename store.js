import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./features/settingsSlice";
import { settingsInitialState } from "./features/settingsData";


const loadLocalStorageData = () => {
    try {
        const data = localStorage.getItem("task.settings");
        if(data) {
            return JSON.parse(data);
        }
        localStorage.setItem("task.settings", JSON.stringify({settings: settingsInitialState}));
        return {settings: settingsInitialState};
    }
    catch(e) {
        console.error(e);
    }
}

const saveToLocalStorage = state => {
    try {
        localStorage.setItem("task.settings", JSON.stringify(state));
    }
    catch(e) {
        console.error(e);
    }
}

const store = configureStore({
    name: "app",
    reducer: {
        settings: settingsReducer
    },
    preloadedState: loadLocalStorageData()
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
