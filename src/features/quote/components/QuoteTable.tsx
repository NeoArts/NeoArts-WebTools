import React, { useEffect, type Dispatch, type SetStateAction } from 'react'
import Details from './Details'
import FormProducts from './FormProducts'
import { setProductAutomatedFields } from '../services/ProductCalc'
import { emptyProduct } from '../constants/emptyProducts'

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
    }

    const saveToLocalStorage = () => {
        localStorage.setItem('currentQuote', JSON.stringify(currentQuote))

        const quotes = localStorage.getItem('quotes')
        const parsedQuotes = quotes ? JSON.parse(quotes) as Quote[] : []
        const updatedQuotes = parsedQuotes.map((q) => q.id === currentQuote.id ? currentQuote : q)
        localStorage.setItem('quotes', JSON.stringify(updatedQuotes))
    }

    const handleAddRow = () => {
        const newProduct = {...emptyProduct, id: currentQuote.products[currentQuote.products.length - 1].id + 1};
        
        setCurrentQuote((quote) => ({
            ...quote,
            products: [...quote.products, newProduct]
        }));
    }

    const handleDeleteRow = (index: number) => {
        const newProducts = currentQuote.products.filter((service, i) => i !== index)
        console.log(newProducts)
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

    return (
        <div>
            <Details 
                openDetails={openDetails} 
                setOpenDetails={setOpenDetails} 
                product={currentProduct.product}
                handleValueChange={handleValueChange}
                onImageChange={onImageChange}
            />
            <div className='w-[calc(100vw-496px)] overflow-scroll py-5'>
            <div className="mx-auto w-full flex flex-col gap-1">
                <div className='flex w-full rounded-lg'>
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
                </div>
                {
                    currentQuote.products?.map((product, index) => {
                        return (
                            <div className='flex w-full rounded-lg relative'>
                                <FormProducts
                                    key={index}
                                    product={product}
                                    handleValueChange={handleValueChange}
                                    onImageChange={onImageChange}
                                    index={index}
                                />
                                <div className='fixed right-10 z-10 w-12 h-12 bg-white p-2'>
                                    <div 
                                        className='w-8 h-8 bg-red-500 p-2 hover:bg-red-700 cursor-pointer rounded-md'
                                        onClick={() => handleDeleteRow(index)}
                                    >
                                        <img src="/icons/trash.svg" alt="delete" />    
                                    </div>
                                </div>
                                <div className='fixed right-20 z-10 w-12 h-12 bg-white p-2'>
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
        </div>
        <div className='pr-24'>
            <button 
                className='w-full rounded-md bg-gray-200 hover:bg-gray-400'
                onClick={handleAddRow}
            >+</button>
        </div>
    </div>
    )
}

export default QuoteTable