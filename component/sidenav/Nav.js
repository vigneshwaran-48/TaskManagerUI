import React, { memo } from 'react'
import Loading from '../common/Loading';
import { useSelector } from 'react-redux';
import { Common } from '../../utility/Common';

const Nav = props => {

    const { name, count, leftElem, id, isLoading, deleteIcon } = props;

    const theme = useSelector(state => state.settings.find(section => section.name === Common.SettingsSectionName.THEME));

    return (
        <div className="nav x-axis-flex">
        {leftElem}
        <p>{name}</p>
        {deleteIcon ? deleteIcon : ""}
        { count > 0 || isLoading
                    ?   
                    <div 
                        className={`count-box 
                            ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}
                             x-axis-flex`}
                    >
                        {isLoading 
                            ? <div className="nav-loading-wrapper"> <Loading width="45px" /> </div> 
                            : <p>{count}</p>}
                    </div>
                    : <div 
                        className={`count-box 
                            ${theme.options[0].value === Common.Theme.LIGHT ? "light-theme" : "dark-theme"}
                             x-axis-flex`}
                      ></div>
        }
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
