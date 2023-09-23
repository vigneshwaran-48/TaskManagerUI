import React from "react";

const Loading = props => {

    const { width } = props;

    return (
        <div 
            className="loading-screen x-axis-flex"
        >
            <img 
                src="/gifs/loading.gif" 
                width={width || "200px"}
                alt="loading" />
        </div>
    );
}

export default Loading;