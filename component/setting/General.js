import React, { useState } from 'react'
import Section from './Section';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../features/settingsSlice';

const General = () => {
    
    const sections = useSelector(state => state.settings);

    const dispatch = useDispatch();

    console.log(sections);

    const onOptionsChange = eventData => {

        dispatch(updateSettings(eventData));
    }

    const sectionElems = sections ? sections.map(setting => {
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