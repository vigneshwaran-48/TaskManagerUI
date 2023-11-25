import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./features/settingsSlice";


const loadLocalStorageData = () => {
    try {
        const data = localStorage.getItem("task.settings");
        return JSON.parse(data);
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
