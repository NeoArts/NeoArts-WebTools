import React from 'react'

function ContextMenu() {
    return (
        <div className='absolute border border-gray-200 bg-white shadow-lg rounded-lg'>
            <ul>
                <li className='p-2 hover:bg-gray-200'>Turn into</li>
            </ul>     
        </div>
    )
}

export default ContextMenu