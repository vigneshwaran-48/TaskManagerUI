import { Common } from "../utility/Common";

export const settingsInitialState = [
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
        // think about it again before changing this.
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
        name: Common.SettingsSectionName.SORT,
        options: [
            {
                id: 1,
                name: "sortTasksBy",
                description: "Sort Tasks by",
                value: 1,
                type: Common.SettingsOptionTypes.RADIO,
                options: [
                    {
                        description: "Name",
                        value: 1
                    },
                    {
                        description: "Created Time",
                        value: 2
                    },
                    {
                        description: "Recently Created",
                        value: 3
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        name: Common.SettingsSectionName.REMINDER,
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