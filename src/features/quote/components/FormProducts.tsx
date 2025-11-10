import React, { useEffect } from 'react'
import Input from '../../../shared/ui/components/Input'
import TextArea from '../../../shared/ui/components/TextArea'
import ImgContainer from './ImgContainer';
import Button from '../../../shared/ui/components/Button';
import ImagePopup from './ImagePopup';
import type { Product } from '../dtos/Product';
import type { DocImage } from '../dtos/DocImage';

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

    const handleAutoPaste = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            let imageFound = false;

            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/')) {
                        imageFound = true;
                        const blob = await clipboardItem.getType(type);
                        const reader = new FileReader();

                        reader.onload = async function (event: any) {
                            const base64String = event.target.result;
                            
                            // Calculate height for the image
                            const img = new Image();
                            img.src = base64String;
                            
                            img.onload = () => {
                                const aspectRatio = img.width / img.height;
                                const desiredWidth = 117;
                                const calculatedHeight = desiredWidth / aspectRatio;
                                
                                handleImageChange({ base64String, height: calculatedHeight });
                            };
                        };

                        reader.readAsDataURL(blob);
                        break;
                    }
                }
                if (imageFound) break;
            }

            if (!imageFound) {
                alert('No hay ninguna imagen en el portapapeles. Por favor, copia una imagen primero.');
            }
        } catch (err) {
            console.error('Error al leer el portapapeles:', err);
            alert('No se pudo acceder al portapapeles. Asegúrate de haber dado permisos al navegador.');
        }
    };

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
            <div className={`${openDetails ? "w-full" : "min-w-48 max-w-48 bg-white"} px-3 font-bold flex flex-col`}>
                {!openDetails && (
                    <div className='flex gap-1 h-10'>
                        {product.image?.base64String ? (
                            <div 
                                className='flex-1 h-full border border-gray-300 rounded overflow-hidden bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors'
                                onClick={() => setShowImage(true)}
                                title='Click para ver imagen completa'
                            >
                                <img 
                                    src={product.image.base64String} 
                                    alt='Preview' 
                                    className='w-full h-full object-contain'
                                />
                            </div>
                        ) : (
                            <Button text='Ver' onClick={() => setShowImage(true)} />
                        )}
                        <button 
                            onClick={handleAutoPaste}
                            className='px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors'
                            title='Pegar imagen del portapapeles'
                        >
                            📋
                        </button>
                    </div>
                )}
                {openDetails && (
                    <ImgContainer imgData={product.image.base64String} setImgData={handleImageChange} />
                )}
            </div>
        </div>
    )
}

export default FormProducts