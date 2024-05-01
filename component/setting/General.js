import React, { useState } from 'react'
import Section from './Section';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../features/settingsSlice';
import { AppAPI } from '../../api/AppAPI';
import { Common } from '../../utility/Common';

const General = () => {
    
    const sections = useSelector(state => state.settings);

    const dispatch = useDispatch();

    const onOptionsChange = async eventData => {
        console.log(eventData);
        const response = await AppAPI.updateSettings(eventData.option.name, eventData.option.value);
        if(response.status !== 200) {
            Common.showErrorPopup(response.error, 2);
            return;
        }
        
        dispatch(updateSettings(eventData));
    }

    const sectionElems = sections ? sections.map(setting => {
        return <Section 
                    key={setting.id}
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