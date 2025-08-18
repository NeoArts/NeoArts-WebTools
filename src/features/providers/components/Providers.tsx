import React, { useEffect, useState } from 'react'
import Button from '../../../shared/ui/components/Button'
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
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
            <Details showPopup={showPopup} setShowPopup={setShowPopup} providerDetails={providerDetails} />
            
            {/* Header Section */}
            <div className='max-w-7xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Proveedores</h1>
                    <p className='text-gray-600'>Gestiona tus proveedores y descuentos</p>
                </div>

                {/* Add New Provider Button - Top */}
                <div className='mb-8'>
                    <Button 
                        text='+ Registrar nuevo proveedor' 
                        onClick={handleOpenPopup}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    />
                </div>

                {providers && providers.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {providers.map((provider, index) => (
                            <div 
                                key={index} 
                                className='group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden transform hover:-translate-y-2'
                            >
                                {/* Card Header */}
                                <div className='bg-gradient-to-r from-blue-500 to-blue-600 p-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center space-x-3'>
                                            <div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
                                                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                                                </svg>
                                            </div>
                                            <h3 className='text-white font-semibold text-lg truncate'>{provider.name}</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className='p-6'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <div className='flex items-center space-x-2'>
                                            <span className='text-sm text-gray-500 font-medium'>Descuento general</span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <div className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold'>
                                                {(provider.discount * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wholesale Discounts Preview */}
                                    {provider.wholesaleDiscount && provider.wholesaleDiscount.length > 0 && (
                                        <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
                                            <div className='flex items-center space-x-2 mb-2'>
                                                <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                                                </svg>
                                                <span className='text-xs text-gray-600 font-medium'>Descuentos por mayoreo</span>
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {provider.wholesaleDiscount.length} nivel{provider.wholesaleDiscount.length !== 1 ? 'es' : ''} configurado{provider.wholesaleDiscount.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <Button 
                                        text='Ver detalles' 
                                        onClick={() => handleEdirProvider(index)}
                                        className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className='bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center max-w-md mx-auto'>
                        <div className='mb-6'>
                            <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                                </svg>
                            </div>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Sin proveedores registrados</h3>
                            <p className='text-gray-500 text-sm mb-6'>Comienza agregando tu primer proveedor para gestionar descuentos y productos</p>
                            <Button 
                                text='Registrar primer proveedor' 
                                onClick={handleOpenPopup}
                                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProvidersSection