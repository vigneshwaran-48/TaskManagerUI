import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { SectionContext } from "../../page/SharedLayout";
import ListTagAddComp from "./ListTagAddComp";

const TagSideNav = () => {

    const { setSection } = useContext(SectionContext);

    const [ openTagBox, setOpenBox ] = useState(false);

    const maintainSection = event => {
        setSection(event.target.innerText);
    }

    const defaultTags = [
        {
            id: 1088,
            name: "school",
            color: "teal"
        },
        {
            id: 1089,
            name: "important",
            color: "red"
        }
    ]
    const [ tags, setTags ] = useState([]);

    if(tags == null || tags.length < 1) {
        setTags(defaultTags);
    }

    const tagElements = tags.map(elem => {
        return (
            <NavLink 
                key={`tag-${elem.id}`}
                style={{
                    backgroundColor: elem.color
                }}
                className="tag-side-nav-child x-axis-flex"
                to={`tags/${elem.id}`}
                onClick={ maintainSection }
            >
                <p>{elem.name}</p>
            </NavLink>
        )
    });

    return (
        <nav className="tag-side-nav y-axis-flex">
            <h4>Tags</h4>
            <div className="tag-side-nav-child-wrapper x-axis-flex">
                {tagElements}
            </div>
            <button 
                onClick={() => setOpenBox(prev => !prev)}
                className="common-button add-new-tag-button x-axis-flex">
                {!openTagBox && <i className="fa fa-solid fa-plus"></i>}
                <p>{openTagBox ? "Close" : "Add Tag"}</p>
            </button>
            {openTagBox && <ListTagAddComp isTag={true} setOpenBox={setOpenBox} />}
        </nav>
    );
}

export default TagSideNav;