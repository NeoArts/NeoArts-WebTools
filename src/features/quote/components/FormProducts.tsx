import React, { useContext, useEffect } from 'react'
import Input from '../../../shared/ui/Input'
import { CurrentProductContext } from './CurrentProductContext'
import TextArea from '../../../shared/ui/TextArea'
import ImgContainer from './ImgContainer';
import Button from '../../../shared/ui/Button';
import Details from './Details';
import ImagePopup from './ImagePopup';
import Dropdown from '../../../shared/ui/Dropdown';

function FormProducts( {openDetails } : { openDetails?: boolean }) {
    
    const { product, index, handleValueChange } = useContext(CurrentProductContext);

    const [imgData, setImgData] = React.useState({} as DocImage)
    const [showImage, setShowImage] = React.useState(false)
    const [providers, setProviders] = React.useState([] as any)

    useEffect(() => {
        const data = localStorage.getItem('providers');
        if(data) {
            setProviders(JSON.parse(data))
        }
    }, [])

    const handleImageChange = (value: DocImage) => {
        handleValueChange(index)({ target: { id: 'product-image', value: imgData } })
        setImgData(value)
    }

    return (
        product && <div className={`${!openDetails ? "flex-row" : "flex-col gap-2"} w-full rounded-lg flex relative`}>
            <ImagePopup open={showImage} setOpen={setShowImage} img={product.image.base64String} handleImageChange={handleImageChange} />
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                {!openDetails ? <Input
                    key={index} 
                    type="text"
                    id={`product-name-${index}`}
                    value={product.name}
                    onInput={handleValueChange(index)}
                    placeholder='Nombre'
                    label={openDetails ? 'Nombre' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                /> : 
                <TextArea
                    id={`product-name-${index}`}
                    value={product.name}
                    onInput={handleValueChange(index)}
                    placeholder='Nombre'
                    label='Nombre'
                    labelPosition='top'
                />
                }
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="text"
                    id={`product-markType-${index}`}
                    value={product.markType}
                    onInput={handleValueChange(index)}
                    placeholder='Tipo de Marca'
                    label={openDetails ? 'Tipo de Marca' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-60 max-w-60 bg-white"} relative px-3 font-bold`}>
                <Input
                    key={index} 
                    type="text"
                    id={`product-provider-${index}`}
                    value={product.provider}
                    onInput={handleValueChange(index)}
                    placeholder='Proveedor'
                    label={openDetails ? 'Proveedor' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-56 max-w-56 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="text"
                    id={`product-providerDiscount-${index}`}
                    value={product.providerDiscount?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='0.4'
                    label={openDetails ? 'Descuento Proveedor' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-unitPrice-${index}`}
                    value={product.unitPrice?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Costo'
                    label={openDetails ? 'Costo' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-quantity-${index}`}
                    value={product.quantity?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Cantidad'
                    label={openDetails ? 'Cantidad' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>  
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-price-${index}`}
                    value={product.price?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Costo dto'
                    disabled={true}
                    label={openDetails ? 'Costo dto' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-markCost-${index}`}
                    value={product.markCost?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Marca'
                    label={openDetails ? 'Marca' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-otherCost-${index}`}
                    value={product.otherCost?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Otros Costos'
                    label={openDetails ? 'Otros Costos' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-totalCost-${index}`}
                    value={product.totalCost?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Costo Total'
                    disabled={true}
                    label={openDetails ? 'Costo Total' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-sellPrice-${index}`}
                    value={product.sellPrice?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Precio de Venta'
                    disabled={true}
                    label={openDetails ? 'Precio de Venta' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-totalValue-${index}`}
                    value={product.totalValue?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Valor Total'
                    disabled={true}
                    label={openDetails ? 'Valor Total' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-profit-${index}`}
                    value={product.profit?.toString()}
                    onInput={handleValueChange(index)}
                    placeholder='Rentabilidad'
                    label={openDetails ? 'Rentabilidad' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                {openDetails ? <ImgContainer imgData={product.image.base64String} setImgData={handleImageChange} /> : <Button text='Ver' onClick={() => setShowImage(true)} />}
            </div>
        </div>
    )
}

export default FormProducts