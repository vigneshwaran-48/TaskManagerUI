import React from 'react'
import { motion } from 'framer-motion';
import { Common } from '../utility/Common';

const Settings = () => {

    return (
        <motion.div 
            initial={Common.mainElementsFramerVariants.slideFromRight}
            animate={Common.mainElementsFramerVariants.stay}
            exit={Common.mainElementsFramerVariants.exit}
            className="app-body-middle today-comp x-axis-flex"
        >
            <div className="settings-navigation-bar">
                
            </div>
            <div className="settings-page">Settings Mainpage</div>
        </motion.div>
    )
}

export default Settings;