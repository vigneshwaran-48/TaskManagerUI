import React from 'react'

const ErrorComp = () => {

    const handleRefresh = () => {
        window.location.reload();
    }
    return (
        <div className="error-comp y-axis-flex">
            <img src="/something-went-wrong.png" alt="Error" />
            <button 
                className="common-button refresh-button"
                onClick={handleRefresh}
                type="button"
            >Refresh</button>
        </div>
    )
}

export default ErrorComp;