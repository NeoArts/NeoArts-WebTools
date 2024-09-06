import React from 'react'
import FlyOut from '../context/FlyOut'

function FlyOutMenu() {
    return (
        <FlyOut>
            <FlyOut.Toggle />
            <FlyOut.List>
                <FlyOut.Item>Turn into</FlyOut.Item>
            </FlyOut.List>
        </FlyOut>
    )
}

export default FlyOutMenu