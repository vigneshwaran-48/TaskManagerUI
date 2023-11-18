import React, { useState } from 'react'
import { Common } from '../../utility/Common';
import SettingOption from './SettingOption';
import Section from './Section';

const General = () => {
    
    const [ generalSettings, setGeneralSettings ] = useState([
        {
            id: 1,
            name: "View",
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
            id: 2,
            name: "Theme",
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
    ]);

    const onOptionsChange = eventData => {

        setGeneralSettings(prevSettingsState => {
            return prevSettingsState.map(section => {
                if(section.id === eventData.sectionId) {
                    const index = section.options.findIndex(option => option.id === eventData.option.id);
                    if(index >= 0) {
                        section.options[index].value = eventData.option.value;
                    }
                    else {
                        console.error("The option that came from event is not in the section that's in state");
                    }
                }
                return section;
            });
        });
    }

    const sectionElems = generalSettings ? generalSettings.map(setting => {
        return <Section 
                    id={setting.id} 
                    name={setting.name} 
                    options={setting.options}
                    onChange={onOptionsChange}
                />
    }) : null;

    

    return (
        <div className="general-settings-page hide-scrollbar y-axis-flex">
            { sectionElems }
        </div>
    )
}

export default General;