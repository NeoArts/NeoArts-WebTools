import React, { useEffect, type Dispatch, type SetStateAction } from 'react'
import Details from './Details'
import FormProducts from './FormProducts'
import DiscountGroupInfo from './DiscountGroupInfo'
import { setProductAutomatedFields } from '../services/ProductCalc'
import { emptyProduct } from '../constants/emptyProducts'
import { updateQuote } from '../services/QuoteController'
import { scrapeProductFromUrl, mapScrapedDataToProduct } from '../services/ProductScraperService'
import type { Product } from '../dtos/Product'
import type { Quote } from '../dtos/Quote'
import type { DocImage } from '../dtos/DocImage'

function QuoteTable({ currentQuote, setCurrentQuote} : { currentQuote: Quote, setCurrentQuote: Dispatch<SetStateAction<Quote>> }) {

    const [openDetails, setOpenDetails] = React.useState(false)
    const [currentProduct, setCurrentProduct] = React.useState({} as { product: Product, index: number })
    const [scrapingUrl, setScrapingUrl] = React.useState('')
    const [isScraperOpen, setIsScraperOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [showGroupInfo, setShowGroupInfo] = React.useState(false)
    const baseUrl = import.meta.env.BASE_URL || '/';

    useEffect(() => {
        if(currentQuote.id) saveToLocalStorage();
    }, [currentQuote])

    const handleValueChange = (product: Product) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedProduct = {
            ...product,
            [e.target.id.split("-")[1]]: e.target.value
        }
        setProductAutomatedFields(updatedProduct, currentQuote.products);
        
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

        // Recalculate all products in the same discount group
        if (updatedProduct.discountGroup) {
            updatedProducts.forEach(p => {
                if (p.discountGroup === updatedProduct.discountGroup && p.provider === updatedProduct.provider) {
                    setProductAutomatedFields(p, updatedProducts);
                }
            });
        }

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

    const handleScrapeProduct = async () => {
        if (!scrapingUrl.trim()) return;
        
        console.log('=== QuoteTable: handleScrapeProduct called ===');
        console.log('Scraping URL:', scrapingUrl);
        
        setIsLoading(true);
        try {
            console.log('Calling scrapeProductFromUrl...');
            const scrapedData = await scrapeProductFromUrl(scrapingUrl);
            console.log('Scraped data received:', scrapedData);
            
            const newProduct = mapScrapedDataToProduct(
                scrapedData, 
                currentQuote.products[currentQuote.products.length - 1].id + 1
            );
            console.log('New product created:', newProduct);
            
            setCurrentQuote((quote) => ({
                ...quote,
                products: [...quote.products, newProduct]
            }));

            setScrapingUrl('');
            setIsScraperOpen(false);
            
            const div = document.getElementById("table-scroll");
            if(div) setTimeout(() => {div.scrollTop = div?.scrollHeight;}, 300);
            
            console.log('Product imported successfully!');
        } catch (error) {
            console.error('=== Error in handleScrapeProduct ===');
            console.error('Error:', error);
            
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert(`Error al importar producto:\n${errorMessage}\n\nRevisa la consola del navegador para más detalles.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Details 
                openDetails={openDetails} 
                setOpenDetails={setOpenDetails} 
                product={currentProduct.product}
                handleValueChange={handleValueChange}
                onImageChange={onImageChange}
            />
            <DiscountGroupInfo isOpen={showGroupInfo} onClose={() => setShowGroupInfo(false)} />
            <div className='w-full max-w-[calc(100vw-20rem)] overflow-scroll'>
                <div className="mx-auto w-full flex flex-col gap-1">
                    <div className='w-full h-auto'>
                        <div id='table-scroll' className='w-full h-[calc(100vh-15rem)] sm:h-[calc(100vh-16rem)] md:h-[calc(100vh-18rem)] lg:h-[calc(100vh-20rem)] relative overflow-scroll'>
                            <div className='flex bg-white items-center w-max rounded-lg mb-1 z-20 sticky top-0 left-0'>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Artículo</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Tipo de Marca</div>
                                <div className='min-w-60 px-5 py-2 font-bold bg-white'>Proveedor</div>
                                <div className='min-w-56 px-5 py-2 font-bold bg-white'>Descuento Proveedor</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Costo</div>
                                <div className='min-w-48 px-5 py-2 font-bold bg-white'>Cantidad</div>
                                <div className='min-w-32 px-5 py-2 font-bold bg-white flex items-center gap-2'>
                                    Grupo Dto
                                    {/* <button
                                        onClick={() => setShowGroupInfo(true)}
                                        className='text-blue-500 hover:text-blue-700 transition-colors'
                                        title='Información sobre grupos de descuento'
                                    >
                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    </button> */}
                                </div>
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
                                                    <img src={`${baseUrl}icons/trash.svg`} alt="delete" />    
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
                                                    <img src={`${baseUrl}icons/duplicate.svg`} alt="delete" />    
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
                                                    <img src={`${baseUrl}icons/info.svg`} alt="delete" />    
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='pr-36 mt-2 flex gap-2'>
                            <button 
                                className='flex-1 rounded-md bg-gray-200 hover:bg-gray-400 py-2'
                                onClick={handleAddRow}
                            >+ Agregar Fila</button>
                            <button 
                                className='flex-1 rounded-md bg-blue-200 hover:bg-blue-400 py-2'
                                onClick={() => setIsScraperOpen(!isScraperOpen)}
                            >🔗 Importar desde URL</button>
                        </div>

                        {isScraperOpen && (
                            <div className='pr-36 mt-2 p-4 bg-blue-50 rounded-md border border-blue-200'>
                                <label className='block mb-2 font-semibold text-gray-700'>URL del Producto:</label>
                                <div className='flex gap-2'>
                                    <input
                                        type='url'
                                        className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        placeholder='https://www.catalogospromocionales.com/p/...'
                                        value={scrapingUrl}
                                        onChange={(e) => setScrapingUrl(e.target.value)}
                                        disabled={isLoading}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleScrapeProduct();
                                            }
                                        }}
                                    />
                                    <button
                                        className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
                                        onClick={handleScrapeProduct}
                                        disabled={isLoading || !scrapingUrl.trim()}
                                    >
                                        {isLoading ? 'Importando...' : 'Importar'}
                                    </button>
                                </div>
                                <p className='mt-2 text-sm text-gray-600'>
                                    Pega la URL del producto de catalogospromocionales.com
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuoteTable