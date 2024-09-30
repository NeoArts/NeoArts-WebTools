import React, { useEffect, type Dispatch, type SetStateAction } from 'react'
import Details from './Details'
import FormProducts from './FormProducts'
import { setProductAutomatedFields } from '../services/ProductCalc'
import { emptyProduct } from '../constants/emptyProducts'
import { updateQuote } from '../services/QuoteController'

function QuoteTable({ currentQuote, setCurrentQuote} : { currentQuote: Quote, setCurrentQuote: Dispatch<SetStateAction<Quote>> }) {

    const [openDetails, setOpenDetails] = React.useState(false)
    const [currentProduct, setCurrentProduct] = React.useState({} as { product: Product, index: number })

    useEffect(() => {
        if(currentQuote.id) saveToLocalStorage();
    }, [currentQuote])

    const handleValueChange = (product: Product) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedProduct = {
            ...product,
            [e.target.id.split("-")[1]]: e.target.value
        }
        setProductAutomatedFields(updatedProduct);
        
        updateProduct(updatedProduct);
    }
    
    const onImageChange = (product: Product) => (imageObj: DocImage) => {
        const updatedProduct = {
            ...product,
            image: imageObj
        }
        
        updateProduct(updatedProduct);
    }
    
    const updateProduct = (updatedProduct: Product) =>
    {
        const updatedProducts = currentQuote.products.map((product, i) => product.id === updatedProduct.id ? updatedProduct : product)

        setCurrentQuote((quote) => ({
            ...quote,
            products: updatedProducts
        }));

        setCurrentProduct({ product: updatedProduct, index: currentProduct.index })
    }

    let saving = false;
    const saveToLocalStorage = () => {
        
        if(!saving){
            saving = true;

            updateQuote(currentQuote).then((result) => {
                saving = false;
            }).catch((e) => {
                saving = false;
            })
        } 
    }

    const handleAddRow = () => {
        const newProduct = {...emptyProduct, id: currentQuote.products[currentQuote.products.length - 1].id + 1};
        
        setCurrentQuote((quote) => ({
            ...quote,
            products: [...quote.products, newProduct]
        }));

        
        const div = document.getElementById("table-scroll");
        if(div) setTimeout(() => {div.scrollTop = div?.scrollHeight;},300)  
    }

    const handleDeleteRow = (index: number) => {
        const newProducts = currentQuote.products.filter((service, i) => i !== index)
        
        if(newProducts.length === 0) {
            setCurrentQuote((quote) => ({
                ...quote,
                products: [emptyProduct]
            }));
            return;
        }

        setCurrentQuote((quote) => ({
            ...quote,
            products: newProducts
        }));
    }

    const handleOpenDetails = (index: number) => {
        setCurrentProduct({ product: currentQuote.products[index], index })
        setOpenDetails(true)
    }

    const handleDuplicate = (index: number) => {
        const product = currentQuote.products[index];
        
        const newProduct: Product = {...product, id: (Number(product.id) + index + 1)};
        const newProducts = [...currentQuote.products, newProduct]
        
        setCurrentQuote((quote) => ({
            ...quote,
            products: newProducts
        }));
    }

    return (
        <div>
            <Details 
                openDetails={openDetails} 
                setOpenDetails={setOpenDetails} 
                product={currentProduct.product}
                handleValueChange={handleValueChange}
                onImageChange={onImageChange}
            />
            <div className='w-[calc(100vw-400px)] overflow-scroll'>
                <div className="mx-auto w-full flex flex-col gap-1">
                    <div className='w-full h-auto'>
                        <div id='table-scroll' className='w-full h-[calc(100vh-240px)] relative overflow-scroll'>
                            <div className='flex bg-white items-center w-max rounded-lg mb-1 z-20 sticky top-0 left-0'>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Artículo</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Tipo de Marca</div>
                                <div className='min-w-60 px-5 py-2 font-bold bg-white'>Proveedor</div>
                                <div className='min-w-56 px-5 py-2 font-bold bg-white'>Descuento Proveedor</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Costo</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Cantidad</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Costo dto</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Marca</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Otros Costos</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Costo Total</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Precio de Venta</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Valor Total</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Rentabilidad</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Imagen</div>
                                <div className='sticky top-0 right-0 z-50 w-36 h-12 bg-white p-2 border border-l-gray-400'>
                                </div>
                            </div>
                            {
                                currentQuote.products?.map((product, index) => {
                                    return (
                                        <div className='flex w-max rounded-lg relative mb-1'>
                                            <FormProducts
                                                key={index}
                                                product={product}
                                                handleValueChange={handleValueChange}
                                                onImageChange={onImageChange}
                                                index={index}
                                            />
                                            <div className='sticky top-0 right-24 z-10 w-12 h-12 bg-white p-2 border-l border-l-gray-400'>
                                                <div 
                                                    className='w-8 h-8 bg-red-500 p-2 hover:bg-red-700 cursor-pointer rounded-md'
                                                    onClick={() => handleDeleteRow(index)}
                                                >
                                                    <img src="/icons/trash.svg" alt="delete" />    
                                                </div>
                                            </div>
                                            <div className='sticky top-0 right-12 z-10 w-12 h-12 bg-white p-2'>
                                                <button 
                                                    data-modal-target="details-modal"
                                                    data-modal-toggle="details-modal"
                                                    className='w-8 h-8 bg-blue-500 p-2 hover:bg-blue-700 cursor-pointer rounded-md'
                                                    type='button'
                                                    onClick={() => handleDuplicate(index)}
                                                >
                                                    <img src="/icons/duplicate.svg" alt="delete" />    
                                                </button>
                                            </div>
                                            <div className='sticky top-0 right-0 z-10 w-12 h-12 bg-white p-2'>
                                                <button 
                                                    data-modal-target="details-modal"
                                                    data-modal-toggle="details-modal"
                                                    className='w-8 h-8 bg-blue-500 p-2 hover:bg-blue-700 cursor-pointer rounded-md'
                                                    type='button'
                                                    onClick={() => handleOpenDetails(index)}
                                                >
                                                    <img src="/icons/info.svg" alt="delete" />    
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='pr-36 mt-2'>
                            <button 
                                className='w-full rounded-md bg-gray-200 hover:bg-gray-400'
                                onClick={handleAddRow}
                            >+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuoteTable