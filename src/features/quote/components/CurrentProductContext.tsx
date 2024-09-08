import React from 'react'

export const CurrentProductContext = React.createContext({} as { product: Product, index: number, handleValueChange: any })

function CurrentProductprovider({ product, index, handleValueChange, children } : { product: Product, index:number, handleValueChange:any, children: any }) {
    return (
        <CurrentProductContext.Provider value={{product, index, handleValueChange}}>
            {children}
        </CurrentProductContext.Provider>
    )
}

export default CurrentProductprovider