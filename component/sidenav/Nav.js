import React from 'react'
import Loading from '../common/Loading';

const Nav = props => {

    const { name, count, iconClassNames, id, isLoading } = props;

    return (
        <div className="nav x-axis-flex">
        <i className={iconClassNames}></i>
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

export default Nav;
