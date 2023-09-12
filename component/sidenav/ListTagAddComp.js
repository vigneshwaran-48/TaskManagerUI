import React, { useState } from "react";

const ListTagAddComp = ( { setOpenBox, isTag } ) => {

    const defaultColors = [
        "#fe6a6b", "#db77f3", "#9675fb", "#5d7dfa",
        "#66d8e9", "#8ce99a", "#ffd43b", "#fe922a"
    ]
    const [ formDetails, setFormDetails ] = useState({
        name: "",
        color: defaultColors[0]
    });

    const handleChange = event => {
        const { name, value } = event.target;
        setFormDetails(prevFormDetails => {
            return {
                ...prevFormDetails,
                [ name ]: value
            }
        });
    }

    const handleSubmit = event => {
        event.preventDefault();

        console.log(formDetails);
        setOpenBox(false);
    }

    const colorInputs = defaultColors.map(elem => {
        return (
            <label 
                className="tag-list-color-box"
                key={`${isTag ? "tag": "list"}-list-color-option-${elem}`}
                htmlFor={`${isTag ? "tag": "list"}-color-option-${elem}`}
                style={{
                    backgroundColor: elem
                }}
            >
                <input 
                    id={`${isTag ? "tag": "list"}-color-option-${elem}`}
                    type="radio"
                    name="color"
                    value={elem}
                    style={{
                        display: "none"
                    }}
                    onChange={handleChange}
                />
            </label>
        )
    });
    return (
        <form 
            onSubmit={handleSubmit}
            className="tag-list-add-form y-axis-flex"
        >
            <div className="tag-list-add-input-wrapper x-axis-flex">
                <div 
                    style={{
                        backgroundColor: formDetails.color
                    }}
                    className="tag-list-color-box"
                ></div>
                <input 
                    type="text" 
                    name="name"
                    value={formDetails.name}
                    placeholder={`${isTag ? "Tag" : "List"} Name`}
                    onChange={handleChange}
                />
            </div>
            <div className="color-box-wrapper x-axis-flex">
                { colorInputs }
            </div>
            <button className="tag-list-add-button common-button">Add</button>
        </form>
    )
}

export default ListTagAddComp;