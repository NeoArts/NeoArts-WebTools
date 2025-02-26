import React, { useEffect } from 'react'
import Dropdown from '../../../shared/ui/components/Dropdown'
import Button from '../../../shared/ui/components/Button'
import { generateInvoice, templates } from '../services/invoiceUtils'
import ServicesTable from './ServicesTable'

function InvoiceGenerator() {

    useEffect(() => {
        setCustomer({
            name: 'Ensafe SAS',
            value: '900392150-2'
        })
    }, [])

    const [services, setServices] = React.useState([{
        id: 0,
        name: '',
        value: 0
    }] as Service[])

    const [service, setService] = React.useState({ name: '', value: '' })

    const [customer, setCustomer] = React.useState({} as { name: string, value: string })

    const handleInvoice = () => {
        const invoice = {
            company: customer,
            services: services
        }
        
        generateInvoice(invoice)
    }

    const handleCustomer = (customer: { name: string, value: string }) => {
        setCustomer(customer);
        setServices([{ id: 0, name: '', value: 0 }]);
    }

    const handleServiceTemplate = (service: { name: string, value: string }) => {
        console.log(service)
        setService(service);

        const template = templates.find(t => t.name === service.name); 

        if(!template) return;

        setServices([{
            id: 0,
            name: template.description,
            value: template.company === customer.name ? template.value : 0
        }])
    }

    return (
        <div className="w-full flex justify-center gap-5">
            <div className='w-full h-[calc(100vh-80px)] flex flex-col justify-between gap-5'>
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-5'>
                        <Dropdown
                            id="customer"
                            value={customer.name}
                            label=""
                            setValue={handleCustomer}
                            options={
                                [
                                    {
                                        name: 'Ensafe SAS',
                                        value: '900392150-2'
                                    }, 
                                    {
                                        name: 'Urbanos Zonas De Creacion Y Construccion SAS',
                                        value: '900.180.604-4'
                                    }, 
                                    {
                                        name: 'Leidy Mayerly Oliveros Cobos',
                                        value: '1.024.514.405'
                                    }
                                ]
                            }
                            placeholder='Selecciona un cliente'
                        />
                        <Dropdown
                            id="service"
                            value={service.name}
                            label=""
                            setValue={handleServiceTemplate}
                            options={
                                [
                                    {
                                        name: 'Manejo de redes',
                                        value: ''
                                    }, 
                                    {
                                        name: 'Identidad Corporativa',
                                        value: '9'
                                    },
                                    {
                                        name: 'Página web',
                                        value: ''
                                    }
                                ]
                            }
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