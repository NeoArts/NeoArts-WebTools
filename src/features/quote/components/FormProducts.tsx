import React, { useEffect } from 'react'
import Input from '../../../shared/ui/Input'
import TextArea from '../../../shared/ui/TextArea'
import ImgContainer from './ImgContainer';
import Button from '../../../shared/ui/Button';
import ImagePopup from './ImagePopup';

function FormProducts( 
{ 
    product, 
    index, 
    handleValueChange, 
    onImageChange, 
    openDetails,
} : 
{ 
    product: Product, 
    index:number, 
    handleValueChange:any, 
    onImageChange: any, 
    openDetails?: boolean,
}) {

    const [showImage, setShowImage] = React.useState(false)

    useEffect(() => {
        
    }, [product])

    const handleImageChange = (value: DocImage) => {
        onImageChange(product)(value)
    }

    return (
        product && <div className={`${!openDetails ? "flex-row" : "flex-col gap-2"} w-full rounded-lg flex relative`}>
            <ImagePopup open={showImage} setOpen={setShowImage} img={product.image?.base64String} handleImageChange={handleImageChange} />
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                {!openDetails ? <Input
                    key={index} 
                    type="text"
                    id={`product-name-${index}`}
                    value={product.name}
                    onInput={handleValueChange(product)}
                    placeholder='Nombre'
                    label={openDetails ? 'Nombre' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                /> : 
                <TextArea
                    id={`product-name-${index}`}
                    value={product.name}
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
                    placeholder='0.4'
                    label={openDetails ? 'Descuento Proveedor' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-cost-${index}`}
                    value={product.cost?.toString()}
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
                    placeholder='Cantidad'
                    label={openDetails ? 'Cantidad' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>  
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold`}>
                <Input
                    key={index} 
                    type="number"
                    id={`product-costOff-${index}`}
                    value={product.costOff?.toString()}
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
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
                    onInput={handleValueChange(product)}
                    placeholder='Rentabilidad'
                    label={openDetails ? 'Rentabilidad' : ''}
                    labelPosition={openDetails ? 'top' : 'left'}
                />
            </div>
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} overflow-scroll px-3 font-bold`}>
                {openDetails ? <ImgContainer imgData={product.image.base64String} setImgData={handleImageChange} /> : <Button text='Ver' onClick={() => setShowImage(true)} />}
            </div>
        </div>
    )
}

export default FormProducts