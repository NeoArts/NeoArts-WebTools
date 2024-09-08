import { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import ProviderDiscountTable from './ProviderDiscountTable'

function Details({ showPopup, setShowPopup, providerDetails } : {showPopup:boolean, setShowPopup:any, providerDetails?:Provider }) {
    
    const [provider, setProvider] = useState({} as Provider)

    useEffect(() => {
        if(providerDetails) {
            setProvider(providerDetails)
        }
    }, [providerDetails])

    const handleValueChange = (e:any) => {
        console.log(provider)
        setProvider({...provider, [e.target.id.split("-")[1]]: e.target.value})
    }

    const handleSaveProvider = () => {
        const data = localStorage.getItem('providers');
        const providers: Provider[] = data ? JSON.parse(data) : [];

        const existentProvider = providers.find((p:Provider) => p.name === provider.name);
        
        if(existentProvider) {
            const updatedProviders = providers.map((p:Provider) => p.name === provider.name ? provider : p);
            localStorage.setItem('providers', JSON.stringify(updatedProviders));
            setProvider({} as Provider)
            setShowPopup(false);
            return;
        }

        providers?.push(provider);
        localStorage.setItem('providers', JSON.stringify(providers));
        setProvider({} as Provider)
        setShowPopup(false);
        window.location.reload();
    }

    const handleDeleteProvider = () => {
        if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
            const data = localStorage.getItem('providers');
            const providers: Provider[] = data ? JSON.parse(data) : [];
    
            const updatedProviders = providers.filter((p:Provider) => p.name !== provider.name);
            localStorage.setItem('providers', JSON.stringify(updatedProviders));
            setProvider({} as Provider)
            setShowPopup(false);
            window.location.reload();
        }
    }

    return (
        <div id="details-modal" tabIndex={-1} aria-hidden="true" className={`${!showPopup && "hidden"} overflow-y-auto overflow-x-hidden bg-opacity-80 bg-black fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-100">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                            Detalles
                        </h3>
                        <div className='flex items-center gap-5'>
                            <button 
                                type="button" 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                                data-modal-hide="details-modal"
                                onClick={() => setShowPopup(false)}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-4 md:p-5 space-y-4 h-[50vh] overflow-scroll">
                        <Input
                            id='provider-name'
                            type='text'
                            label='Proveedor'
                            labelPosition='top'
                            placeholder='PROMOS'
                            value={provider?.name}
                            onInput={handleValueChange}
                        />
                        <Input
                            id='provider-discount'
                            type='number'
                            min={0}
                            max={1}
                            label='Descuento del proveedor'
                            labelPosition='top'
                            placeholder='0.4'
                            value={provider.discount?.toString()}
                            onInput={handleValueChange}
                        />
                        <ProviderDiscountTable provider={provider} setProvider={setProvider} />
                    </div>
                    <div className="flex items-center gap-5 justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <Button text={`Eliminar`} onClick={() => handleDeleteProvider()} />
                        <Button text={`Guardar`} onClick={() => handleSaveProvider()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details