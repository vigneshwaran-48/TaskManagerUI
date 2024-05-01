import { Common } from "../utility/Common";

export const settingsInitialState = [
    {
        id: 1,
        name: Common.SettingsSectionName.VIEW,
        options: [
            {
                id: 1,
                name: "shouldGroupTasks",
                description: "Group Tasks",
                type: Common.SettingsOptionTypes.CHECKBOX,
                value: false
            }
        ]
    },
    {
        id: 2,
        name: Common.SettingsSectionName.GROUP_BY,
        options: [
            {
                id: 12,
                name: "groupTasksBy",
                description: "Group Tasks By",
                type: Common.SettingsOptionTypes.RADIO,
                value: "createdTime",
                options: [
                    {
                        description: "Created Time",
                        value: "createdTime"
                    },
                    {
                        description: "Due Date",
                        value: "dueDate"
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: Common.SettingsSectionName.SORT_GROUP_BY,
        options: [
            {
                id: 98,
                name: "sortGroupBy",
                description: "Sort Group Taks By",
                value: Common.GroupSortOptions.ASCENDING,
                type: Common.SettingsOptionTypes.RADIO,
                options: [
                    {
                        description: "Ascending",
                        value: Common.GroupSortOptions.ASCENDING
                    },
                    {
                        description: "Descending",
                        value: Common.GroupSortOptions.DESCENDING
                    }
                ]
            }
        ]
    },
    {
        // If confused about this data structure, This is because when we have multiple options in
        // a single Section in that time this nested of options will work. If you have doubt 
        // think about it again before changing this.
        id: 4,
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
        id: 5,
        name: Common.SettingsSectionName.SORT,
        options: [
            {
                id: 89,
                name: "sortBy",
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
    }
]