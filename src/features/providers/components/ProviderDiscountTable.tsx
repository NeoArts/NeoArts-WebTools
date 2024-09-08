import React, { useEffect } from 'react'
import Input from '../../../shared/ui/Input'

function ProviderDiscountTable({ provider, setProvider } : { provider: Provider, setProvider: any }) {

    useEffect(() => {
        if(!provider.wholesaleDiscount || provider.wholesaleDiscount.length === 0) {
            provider.wholesaleDiscount = [{ id:0, amount: 0, discount: 0 }]
        }
    }, [provider])

    const handleAddRow = () => {
        setProvider({ ...provider, wholesaleDiscount: [...provider.wholesaleDiscount, { id: provider.wholesaleDiscount.length, amount: 0, discount: 0 }] })
    }

    const handleDeleteRow = (index: number) => {
        const updatedDiscounts = provider.wholesaleDiscount.filter((discount) => discount.id !== index)
        
        if(updatedDiscounts.length === 0) {
            updatedDiscounts.push({ id: 0, amount: 0, discount: 0 })
        }
        
        setProvider({ ...provider, wholesaleDiscount: updatedDiscounts })
    }

    return (
        <div className='w-full flex flex-col gap-1'>
            <p className='mb-2'>Descuentos:</p>
            <div className={`w-full flex font-bold`}>
                <div className='w-1/2 px-5 py-2 bg-white'>Monto</div>
                <div className='w-1/2 px-5 py-2 bg-white'>Descuento</div>
            </div>
            {
                provider?.wholesaleDiscount?.map((discount, index) => {
                    return (
                        <div key={index} className={`w-full flex`}>
                            <Input
                                id={`discount-provider-${index}`}
                                type='text'
                                value={discount.amount.toString()}
                                onInput={(e: any) => setProvider({ ...provider, wholesaleDiscount: provider.wholesaleDiscount.map((d: any) => d.id === index ? { ...d, amount: e.target.value } : d) })}
                            />
                            <Input
                                id={`discount-value-${index}`}
                                type='number'
                                value={discount.discount.toString()}
                                onInput={(e: any) => setProvider({ ...provider, wholesaleDiscount: provider.wholesaleDiscount.map((d: any) => d.id === index ? { ...d, discount: e.target.value } : d) })}
                            />
                            <div className='flex items-center justify-center w-12 bg-white'>
                                <div 
                                    className='w-8 h-8 bg-red-500 p-2 hover:bg-red-700 cursor-pointer rounded-md'
                                    onClick={() => handleDeleteRow(index)}
                                >
                                    <img src="/icons/trash.svg" alt="delete" />    
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <div>
                <button 
                    className='w-full rounded-md bg-gray-200 hover:bg-gray-400'
                    onClick={handleAddRow}
                >+</button>
            </div>
        </div>
    )
}

export default ProviderDiscountTable