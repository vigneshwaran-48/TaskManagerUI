import { createSlice, current } from "@reduxjs/toolkit";
import { settingsInitialState } from "./settingsData";
import { Common } from "../utility/Common";

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
        },
        updateShouldGroupTasks: (state, action) => {
            const { payload } = action;

            state = state.map(section => {
                if(section.name === Common.SettingsSectionName.VIEW) {
                    section.options = section.options.map(option => {
                        if(option.name === "shouldGroupTasks") {
                            option.value = payload.value
                        }
                        return option;
                    });
                }
                return section;
            });
        },
        updateSettingsByOption: (state, action) => {
            const { payload } = action;

            state = state.map(section => {
                if(section.name === payload.sectionName) {
                    section.options[0].value = payload.value;
                }
                return section;
            });
        }
    }
});

export const { updateSettings, updateShouldGroupTasks, updateSettingsByOption } = settingsSlice.actions;
export default settingsSlice.reducer;