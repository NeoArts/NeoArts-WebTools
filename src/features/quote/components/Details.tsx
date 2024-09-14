import React, { useContext, useState } from 'react'
import Button from '../../../shared/ui/Button'
import FormProducts from './FormProducts';
import { CurrentProductContext } from './CurrentProductContext';
import Input from '../../../shared/ui/Input';
import { setProductAutomatedFields } from '../services/ProductCalc';

function Details({ setOpenDetails, openDetails, product, handleValueChange, onImageChange } : { setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>, openDetails: boolean, product: Product, handleValueChange:any, onImageChange:any }) {
    
    const [showSacales, setShowScales] = useState(false);
    const [scales, setScales] = React.useState('')
    const { index } = useContext(CurrentProductContext);
    
    const handleSave = () => {
        setOpenDetails(false)

        if(!showSacales) return;

        createScales();
    }

    const createScales = () => {
        const products = localStorage.getItem('products');
        const productsJson = JSON.parse(products || "");
        const scalesArray = scales.split(',');

        scalesArray.forEach((scale: string, index:number) => {
            let newProduct: Product = {...product, quantity: Number(scale), id: (Number(product.id) + index + 1)};
            setProductAutomatedFields(newProduct);
            productsJson.push(newProduct);
        })
        
        localStorage.setItem('products', JSON.stringify(productsJson));
        window.location.reload();
    }


    return (
        <div id="details-modal" tabIndex={-1} aria-hidden="true" className={`${!openDetails && "hidden"} overflow-y-auto overflow-x-hidden bg-opacity-80 bg-black fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-100">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                            Detalles
                        </h3>
                        <div className='flex items-center gap-5'>
                            <Button text={`${showSacales ? "Cancelar" : "Crear escalas"}`} onClick={() => setShowScales(!showSacales)} />
                            <button 
                                type="button" 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                                data-modal-hide="details-modal"
                                onClick={() => setOpenDetails(false)}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-4 md:p-5 space-y-4 h-[50vh] overflow-scroll">
                        {showSacales ? 
                            <div>
                                <Input 
                                    type="text"
                                    id={`scales-input`}
                                    value={scales}
                                    onInput={(e: any) => setScales(e.target.value)}
                                    placeholder='100, 1000, 10000'
                                    label={'Escalas'}
                                    labelPosition={'top'}
                                />    
                            </div> : 
                            <FormProducts 
                                openDetails={openDetails} 
                                index={index}
                                product={product}
                                handleValueChange={handleValueChange}
                                onImageChange={onImageChange}
                            />
                        }
                    </div>
                    <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <Button text={`${showSacales ? "Crear escalas" : "Guardar"}`} onClick={() => handleSave()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details