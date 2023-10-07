import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import { SectionContext } from './SharedLayout';

const MainBody = () => {

   const { section } = useContext(SectionContext);
    
    return (
        <div className="app-main-body y-axis-flex">
            <div className="app-body-header x-axis-flex">
                <h1>{ section }</h1>
            </div>
            <Outlet />
        </div>
    )
}

export default MainBody;