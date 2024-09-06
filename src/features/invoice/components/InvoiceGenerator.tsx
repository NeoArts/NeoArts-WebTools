import React, { useEffect } from 'react'
import Dropdown from '../../../shared/ui/Dropdown'
import Button from '../../../shared/ui/Button'
import { generateInvoice, templates } from '../services/invoiceUtils'
import ServicesTable from './ServicesTable'

function InvoiceGenerator() {

    useEffect(() => {
        setCustomer('Ensafe SAS')
    }, [])

    const [services, setServices] = React.useState([{
        id: 0,
        name: '',
        value: 0
    }] as Service[])

    const [service, setService] = React.useState('')

    const [customer, setCustomer] = React.useState('')

    const handleInvoice = () => {
        const invoice = {
            company: customer,
            services: services
        }
        
        generateInvoice(invoice)
    }

    const handleCustomer = (customer: string) => {
        setCustomer(customer);
        setServices([{ id: 0, name: '', value: 0 }]);
    }

    const handleServiceTemplate = (service: string) => {
        setService(service);

        const template = templates.find(t => t.name === service); 

        if(!template) return;

        setServices([{
            id: 0,
            name: template.description,
            value: template.company === customer ? template.value : 0
        }])
    }

    return (
        <div className="w-full flex justify-center gap-5">
            <div className='w-full h-[calc(100vh-80px)] flex flex-col justify-between gap-5'>
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-5'>
                        <Dropdown
                            id="customer"
                            value={customer}
                            label=""
                            setValue={handleCustomer}
                            options={['Ensafe SAS', 'Stunnink Walls']}
                            placeholder='Selecciona un cliente'
                        />
                        <Dropdown
                            id="service"
                            value={service}
                            label=""
                            setValue={handleServiceTemplate}
                            options={['Manejo de redes', 'Identidad Corporativa', 'Página web']}
                            placeholder='Selecciona un servicio'
                        />
                    </div>
                    <ServicesTable services={services} setServices={setServices} />
                </div>
                <div>
                    <Button 
                        onClick={() => handleInvoice()} 
                        text="Generar cuenta de cobro"
                    />
                </div>
            </div>
        </div>
    )
}

export default InvoiceGenerator