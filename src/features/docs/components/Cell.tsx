import React, { useContext } from 'react'
import { FlyOutContext } from '../context/FlyOut'
import FlyOutMenu from './FlyOutMenu';

function Cell() {

    const [showTrigger, toggleTrigger] = React.useState(false)

    function handleFocus() {
        toggleTrigger(true);
    }

    return (
        <div className='relative w-32 h-8'>
            <input 
                type={"text"}
                className={`
                    border-2 w-full h-full focus:outline-none focus:border-blue-500
                `} 
                onFocus={handleFocus}
            />
            {showTrigger && <FlyOutMenu />}
        </div>
    )
}

export default Cell