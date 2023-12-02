import React from 'react'
import { Common } from '../../utility/Common';

const SettingOption = props => {

    const { id, name, value, description, type, onChange, options } = props;

    let elems;

    if(type === Common.SettingsOptionTypes.CHECKBOX) {
        elems = (
            <div className="settins-checkbox-option x-axis-flex">
                <input 
                    type="checkbox" 
                    id={`settings-option-${id}`} 
                    name={name} 
                    checked={value}
                    onChange={event => onChange({event, id, name, value: event.target.checked})}
                />
                <label htmlFor={`settings-option-${id}`}>{ description }</label>
            </div>
        )
    }
    else if(type === Common.SettingsOptionTypes.RADIO) {
        let idCounter = 0;
        const radioOptions = options.map(option => {
            idCounter++;
            return (
                <div key={idCounter} className="settins-radio-option x-axis-flex">
                    <input 
                        type="radio" 
                        name={name} 
                        value={option.value}
                        id={`settings-option-${id}-${idCounter}`}
                        onChange={event => onChange({event, id, name, value: option.value})}
                        checked={value === option.value}
                    />
                    <label htmlFor={`settings-option-${id}-${idCounter}`} >{option.description}</label>
                </div>
            )
        });
        elems = (
            <div className="settings-radio-options-container y-axis-flex">
                { radioOptions }
            </div>
        );
    }

    return (
        elems 
    )
}

export default SettingOption;
