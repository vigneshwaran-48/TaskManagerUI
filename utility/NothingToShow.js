import React from "react";
import { Common } from "./Common";

const NothingToShow = props => {

    let { img, message, optionalElems } = props;

    if(!img) {
        img = Common.defaultNothingImage;
    }
    if(!message) {
        message = "Nothing here!";
    }
    return (
        <div className="nothing-to-show-comp y-axis-flex">
            <img src={img} alt="Nothing here" />
            <h2>{message}</h2>
            {optionalElems != null && optionalElems}
        </div>
    )
}

export default NothingToShow;