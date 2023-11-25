import { createSlice } from "@reduxjs/toolkit";
import { settingsInitialState } from "./settingsData";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: settingsInitialState,
    reducers: {
        updateSettings: (state, action) => {
            const { payload } = action;
            let changed = false;

            state = state.map(section => {
                const index = section.options.findIndex(option => option.id === payload.option.id);
                if(index >= 0) {
                    section.options[index].value = payload.option.value;
                    changed = true;
                }
            });
            if(!changed) {
                console.error("The option that came from event is not in the section that's in state");
            }
        }
    }
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;