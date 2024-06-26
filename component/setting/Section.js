import React from 'react'
import SettingOption from './SettingOption';

const Section = props => {

    const { name, id, options, onChange } = props;

    const handleOptionsChange = props => {

        onChange({
            sectionId: id,
            sectionName: name,
            option: {
                id: props.id,
                name: props.name,
                value: props.value
            }
        });
    }

    const optionsElems = options ? options.map(option => 
        <SettingOption 
            key={option.id}
            id={option.id} 
            name={option.name} 
            description={option.description}
            options={option.options}
            type={option.type}
            onChange={handleOptionsChange}
            value={option.value}
        />
    ) : null;

    return (
        <div className="general-settings-section y-axis-flex">
            <p className="settings-section-name">{ name }</p>
            { optionsElems }
        </div>
    )
}

export default Section;