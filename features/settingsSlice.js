import { createSlice } from "@reduxjs/toolkit";
import { Common } from "../utility/Common";

const initialState = [
    {
        id: 1,
        name: Common.SettingsSectionName.VIEW,
        options: [
            {
                id: 12,
                name: "showCompletedTasksInListView",
                description: "Show Completed Task in List View",
                type: Common.SettingsOptionTypes.CHECKBOX,
                value: false
            }
        ]
    },
    {
        // If confused about this data structure, This is because when we have multiple options in
        // a single Section in that time this nested of options will work. If you have doubt 
        // think about it again before changinh this.
        id: 2,
        name: Common.SettingsSectionName.THEME,
        options: [
            {
                id: 14,
                name: "theme",
                description: "Theme",
                type: Common.SettingsOptionTypes.RADIO,
                value: "light",
                options: [
                    {
                        description: "Light",
                        value: "light"
                    },
                    {
                        description: "Dark",
                        value: "dark"
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Reminder",
        options: [
            {
                id: 18,
                name: "remindAboutOverdueTasks",
                description: "Remind me about overdue tasks",
                type: Common.SettingsOptionTypes.CHECKBOX,
                value: false
            }
        ]
    }
]

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
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