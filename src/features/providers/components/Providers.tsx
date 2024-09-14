import React, { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button'
import Details from './Details';

function ProvidersSection() {

    const [providers, setProviders] = useState([] as Provider[])
    const [providerDetails, setProviderDetails] = useState({} as Provider)
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        const proveedores = localStorage.getItem('providers');

        if(!proveedores) return;

        setProviders(JSON.parse(proveedores));
    }, [])

    const handleOpenPopup = () => {
        setShowPopup(true);
        setProviderDetails({
            name: '',
            discount: 0,
            id: 0,
            wholesaleDiscount: []
        })
    }

    const handleEdirProvider = (index: number) => {
        setShowPopup(true);

        const data = localStorage.getItem('providers');
        const providers: Provider[] = data ? JSON.parse(data) : [];
        const provider = providers[index];
        setProviderDetails(provider);
    }

    return (
        <div className='flex flex-col gap-5'>
            <Details showPopup={showPopup} setShowPopup={setShowPopup} providerDetails={providerDetails} />
            {providers && providers.length > 0 ?
                <div className='grid grid-cols-2 gap-5'>
                    {
                        providers.map((provider, index) => (
                            <div key={index} className='flex items-center justify-between p-5 bg-white rounded-lg'>
                                <div className='flex flex-col gap-5'>
                                    <p className='font-bold'>{provider.name}</p>
                                    <p>{(provider.discount * 100).toFixed(2)}%</p>
                                </div>
                                <div>
                                    <Button 
                                        text='Ver detalles' 
                                        onClick={() => handleEdirProvider(index)}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
                :
                <div className='w-full flex items-center justify-center h-48 border border-dashed border-gray-400 rounded-lg'>
                    Aún no hay proveedores resgitrados
                </div>
            }
            <Button text='Registrar nuevo proveedor' onClick={handleOpenPopup} />
        </div>
    )
}

export default ProvidersSection