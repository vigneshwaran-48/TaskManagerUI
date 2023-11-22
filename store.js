import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./features/settingsSlice";

export const store = configureStore({
    name: "app",
    reducer: {
        settings: settingsReducer
    }
})

