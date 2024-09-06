import React, { useEffect } from 'react'
import Input from '../../../shared/ui/Input'
import TextArea from '../../../shared/ui/TextArea'

function ServicesTable({ services, setServices } : { services: Service[], setServices: any }) {

    useEffect(() => {
        const savedServices = localStorage.getItem('services')
        if(savedServices && JSON.parse(savedServices).length > 0) {
            setServices(JSON.parse(savedServices))
        }
    }, [])

    const handleNameChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        handleServiceChange('name', e, index)
        saveToLocalStorage(services)
    }

    const handleValueChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        handleServiceChange('value', e, index)
        saveToLocalStorage(services)
    }

    const handleServiceChange = (prop: string, e: any, index: number) => {
        const newServices : any = [...services]
        newServices[index][prop] = (prop === 'value' ? parseInt(e.target.value) : e.target.value);
        setServices(newServices)
    }

    const saveToLocalStorage = (services:any) => {
        localStorage.setItem('services', JSON.stringify(services))
    }

    const handleAddRow = () => {
        saveToLocalStorage([...services, {
            id: services.length,
            name: '',
            value: 0
        }])
        setServices([...services, {
            id: services.length,
            name: '',
            value: 0
        }])
    }

    const handleDeleteRow = (index: number) => {
        const newServices = services.filter((service, i) => i !== index)

        if(newServices.length === 0) {
            newServices.push({
                id: 0,
                name: '',
                value: 0
            })
        }

        saveToLocalStorage(newServices)
        setServices(newServices)
    }

    return (
        <div>
            <div 
                className='text-left flex flex-col gap-1'
            >
                <div className='rounded-md flex bg-white'>
                    <div className='w-full flex'>
                        <div className='w-1/2 font-bold p-2'>Servicio</div>
                        <div className='w-1/2 font-bold p-2'>Valor</div>
                    </div>
                    <div className='w-10 font-bold p-2'></div>
                </div>
                {
                    services.map((service:Service, index:number) => (
                        <div 
                            key={index}
                            className='flex relative items-center'
                        >
                            <div className='w-full flex'>
                                <div className='w-1/2 '>
                                    <Input
                                        id="service"
                                        placeholder='Nombre del servicio'
                                        value={service.name}
                                        onInput={handleNameChange(index)}
                                        type='text'
                                    />
                                </div>
                                <div className='w-1/2 bg-white h-full'>
                                    <Input
                                        id="value"
                                        value={service.value.toString()}
                                        type="number"
                                        onInput={handleValueChange(index)}
                                    />
                                </div>
                            </div>
                            <div className='w-12 bg-white h-full p-2'>
                                <div 
                                    className='w-8 h-8 bg-red-500 p-2 hover:bg-red-700 cursor-pointer rounded-md'
                                    onClick={() => handleDeleteRow(index)}
                                >
                                    <img src="/icons/trash.svg" alt="delete" />    
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <button 
                className='w-full mt-2 rounded-md bg-gray-200 hover:bg-gray-400'
                onClick={handleAddRow}
            >+</button>
        </div>
    )
}

export default ServicesTable