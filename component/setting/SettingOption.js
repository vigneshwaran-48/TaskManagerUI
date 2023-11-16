import React from 'react'
import { Common } from '../../utility/Common';

const SettingOption = props => {

    const { id, name, value, description, type, onChange, optionElems } = props;

    let elems;

    if(type === Common.SettingsOptionTypes.CHECKBOX) {
        elems = (
            <div className="settins-checkbox-option x-axis-flex">
                <input 
                    type="checkbox" 
                    id={`settings-option-${id}`} 
                    name={name} 
                    value={value}
                    onChange={onChange}
                />
                <label for={`settings-option-${id}`}>{ description }</label>
            </div>
        )
    }
    else if(type === Common.SettingsOptionTypes.RADIO) {
        let idCounter = 0;
        elems = optionElems.map(option => {
            idCounter++;
            return (
                <div className="settins-radio-option x-axis-flex">
                    <input type="radio" name={name} id={`settings-option-${idCounter}`} />
                    <label for={`settings-option-${idCounter}`} >{option.description}</label>
                </div>
            )
        });
    }

    return (
        elems 
    )
}

export default SettingOption;
