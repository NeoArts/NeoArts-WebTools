    import React, { useContext } from 'react'

    export const FlyOutContext = React.createContext({})

    function FlyOut({ children } : { children: React.ReactNode }) {

        const [open, toggle] = React.useState(false)
        const [selectedCell, setCell] = React.useState({ x: 0, y: 0 })

        function setSelectedCell({ x, y } : { x: number, y: number }) {
            setCell({ x, y })
        }

        return (
            <FlyOutContext.Provider value={{open, toggle, setSelectedCell}}>
                {children}
            </FlyOutContext.Provider>
        )
    }

function Toggle() {
    const { open, toggle } : any = React.useContext(FlyOutContext);
  
    return (
        <div className="w-8 h-6 p-1 cursor-pointer z-20 absolute top-0 -left-9 shadow-sm bg-gray-200 rounded-md" onClick={() => toggle(!open)}>
            <img src="/icons/drag.svg" className='w-4 m-auto' alt="drag" />
        </div>
    );
}

function List({ children } : { children: React.ReactNode }) {
    const { open } : any = useContext(FlyOutContext);
    return (open && 
        <ul className='w-64 absolute -left-9 bg-white shadow-lg border border-gray-200 rounded-xl'>{children}</ul>
    );
}
  
function Item({ children } : { children: React.ReactNode }) {
    const { open, toggle } : any = useContext(FlyOutContext);

    return (
        <li 
            onClick={() => {}}
            className='cursor-pointer hover:bg-gray-200 px-5 py-2 rounded-xl'
        >
            {children}
        </li>
    );
}
  
FlyOut.Toggle = Toggle;
FlyOut.List = List;
FlyOut.Item = Item;

export default FlyOut