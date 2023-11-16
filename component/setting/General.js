import React, { useState } from 'react'
import { Common } from '../../utility/Common';
import SettingOption from './SettingOption';

const General = () => {
    
    const [ generalSettings, setGeneralSettings ] = useState([
        {
            sectionId: 1,
            sectionName: "View",
            settingOptions: [
                {
                    optionId: 2,
                    optionName: "showCompletedTasksInListView",
                    description: "Show Completed Task in List View",
                    optionType: Common.SettingsOptionTypes.CHECKBOX
                },
                {
                    optionId: 3,
                    optionName: "theme",
                    description: "Theme",
                    optionType: Common.SettingsOptionTypes.RADIO,
                    optionElems: [
                        {
                            description: "Test"
                        }
                    ]
                }
            ]
        }
    ]);

    

    return (
        <div className="general-settings-page hide-scrollbar y-axis-flex">

            <section className="general-settings-section view-settings-section y-axis">
                <SettingOption 
                    id={2} 
                    name="showCompletedTasksInListView"
                    description="Show Completed Task in List View"
                    type={Common.SettingsOptionTypes.CHECKBOX}
                    // onChange={}
                />
            </section>
        </div>
    )
}

export default General;