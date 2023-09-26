import React, { useState } from "react";
import { ListAPI } from "../../api/ListAPI";
import { Common } from "../../utility/Common";

const ListTagAddComp = ( { setOpenBox, isTag, addList } ) => {

    const defaultColors = [
        "#fe6a6b", "#db77f3", "#9675fb", "#5d7dfa",
        "#66d8e9", "#8ce99a", "#ffd43b", "#fe922a"
    ]
    const [ formDetails, setFormDetails ] = useState({
        listName: "",
        listColor: defaultColors[0]
    });
    const [ isSubmiting, setIsSubmiting ] = useState(false);

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

        setIsSubmiting(true);

        addList(formDetails);

        setIsSubmiting(false);
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
                    name="listColor"
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
                        backgroundColor: formDetails.listColor
                    }}
                    className="tag-list-color-box"
                ></div>
                <input 
                    type="text" 
                    name="listName"
                    value={formDetails.listName}
                    placeholder={`${isTag ? "Tag" : "List"} Name`}
                    onChange={handleChange}
                />
            </div>
            <div className="color-box-wrapper x-axis-flex">
                { colorInputs }
            </div>
            <button 
                className="tag-list-add-button common-button"
                type={isSubmiting ? "button" : "submit"}
            >
                {isSubmiting ? "Submiting ..." : "Add"}
            </button>
        </form>
    )
}

export default ListTagAddComp;