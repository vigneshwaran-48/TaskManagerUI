import React, { memo } from 'react'
import Loading from '../common/Loading';

const Nav = props => {

    const { name, count, leftElem, id, isLoading } = props;

    return (
        <div className="nav x-axis-flex">
        {leftElem}
        <p>{name}</p>
        { count > 0 
                    ?   <div className="count-box x-axis-flex">
                            {isLoading 
                                ? <div className="nav-loading-wrapper"> <Loading width="45px" /> </div> 
                                : <p>{count}</p>}
                        </div>
                    : ""}
        </div>
    );
}

const IsNavEqual = (prevNav, newNav) => {

    if(prevNav.name !== newNav.name) {
        return false;
    } 
    else if(prevNav.count !== newNav.count) {
        return false;
    }
    else if(prevNav.listColor && prevNav.listColor !== newNav.listColor) {
        return false;
    }
    else if (prevNav.isLoading !== newNav.isLoading) {
        return false;
    }
    else {
        return true;
    }
}
export default memo(Nav, IsNavEqual);
