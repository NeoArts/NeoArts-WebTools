import React, { useEffect } from 'react'
import Details from './Details'
import CurrentProductprovider from './CurrentProductContext'
import FormProducts from './FormProducts'

function QuoteTable({ products, setProducts } : { products: Product[], setProducts: any }) {

    const [openDetails, setOpenDetails] = React.useState(false)
    const [providers, setProviders] = React.useState([] as any)
    const [currentProduct, setCurrentProduct] = React.useState({} as { product: Product, index: number })

    const emptyProduct = {
        id: 0,
        name: '',
        markCost: 0,
        markType: '',
        otherCost: 0,
        price: 0,
        profit: 0,
        provider: '',
        providerDiscount: 0,
        quantity: 0,
        sellPrice: 0,
        totalCost: 0,
        totalValue: 0,
        image: { base64String: '', height: 0 },
        unitPrice: 0
    }

    useEffect(() => {
        const savedProdcts = localStorage.getItem('products')
        if(savedProdcts && JSON.parse(savedProdcts).length > 0) {
            setProducts(JSON.parse(savedProdcts))
        }
    }, [])

    useEffect(() => {
        const data = localStorage.getItem('providers');
        if(data) {
            setProviders(JSON.parse(data))
        }
    }, [])

    const handleValueChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedProducts = [...products];
        
        updatedProducts[index] = { ...updatedProducts[index], [e.target.id.split("-")[1]]: e.target.value };

        calculateAutoFields(updatedProducts, index);
        
        setCurrentProduct({ product: updatedProducts[index], index })
        setProducts(updatedProducts);
        saveToLocalStorage(updatedProducts)
    }

    const calculateAutoFields = (updatedProducts: Product[], index: number) => {
        const product = updatedProducts[index];
        
        const provider = providers.find((p:any) => p.name === product.provider);
        console.log(provider)
        product.providerDiscount = provider ? provider.discount : product.providerDiscount;

        let price : number = product.unitPrice - Number(product.unitPrice * Number(product.providerDiscount));
        const totalUnitsPrice = product.unitPrice * product.quantity;

        if(provider && provider.wholesaleDiscount.length > 0) {
            const discounts = provider.wholesaleDiscount.sort((a: any, b: any) => b.amount - a.amount);

            for (let i = 0; i < discounts.length; i++) {
                const w = discounts[i];
                console.log(totalUnitsPrice, w.amount)
                if(totalUnitsPrice >= w.amount) {
                    price = product.unitPrice * (1 - w.discount);
                    break;
                }
            }
        }
        
        const totalCost = Number(product.unitPrice.toString()) + Number(product.markCost.toString()) + Number(product.otherCost.toString());
        const sellPrice = Math.round(product.profit ? (totalCost / (product.profit/100)) : totalCost);
        const totalValue = Math.round(product.quantity * sellPrice);

        updatedProducts[index] = { ...updatedProducts[index], totalCost, sellPrice, totalValue, price };
        setProducts(updatedProducts);
    }

    const saveToLocalStorage = (products:any) => {
        localStorage.setItem('products', JSON.stringify(products))
    }

    const handleAddRow = () => {
        saveToLocalStorage([...products, emptyProduct])
        setProducts([...products, emptyProduct])
    }

    const handleDeleteRow = (index: number) => {
        const newProducts = products.filter((service, i) => i !== index)

        if(newProducts.length === 0) {
            newProducts.push(emptyProduct)
        }

        saveToLocalStorage(newProducts)
        setProducts(newProducts)
    }

    const handleOpenDetails = (index: number) => {
        setCurrentProduct({ product: products[index], index })
        setOpenDetails(true)
    }

    return (
        <div>
            <CurrentProductprovider product={currentProduct.product} index={currentProduct.index} handleValueChange={handleValueChange}>
                <Details setOpenDetails={setOpenDetails} openDetails={openDetails} />
            </CurrentProductprovider>
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
                    products.map((product, index) => {
                        return (
                            <div className='flex w-full rounded-lg relative'>
                                <CurrentProductprovider product={product} index={index} handleValueChange={handleValueChange}>
                                    <FormProducts
                                        key={index}
                                    />
                                </CurrentProductprovider>
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