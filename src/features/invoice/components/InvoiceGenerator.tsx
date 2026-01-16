import React, { useEffect } from 'react'
import Select, { type SelectOption } from '../../../shared/ui/components/Select'
import Button from '../../../shared/ui/components/Button'
import ToastProvider from '../../../shared/ui/components/ToastProvider'
import { generateInvoice, templates } from '../services/invoiceUtils'
import { generateInvoiceId } from '../services/invoiceIdGenerator'
import { NotificationService } from '../../../shared/services/notifications'
import ServicesTable from './ServicesTable'
import InvoiceHistory from './InvoiceHistory'
import type { Service } from '../dtos/Service'

function InvoiceGenerator() {

    useEffect(() => {
        setCustomer({
            name: 'Ensafe SAS',
            value: '900392150-2'
        });
        
    }, [])

    const [services, setServices] = React.useState([{
        id: 0,
        name: '',
        value: 0
    }] as Service[])

    const [service, setService] = React.useState({ name: '', value: '' })
    const [customer, setCustomer] = React.useState({} as { name: string, value: string })
    const [showHistory, setShowHistory] = React.useState(false)

    const handleInvoice = async () => {
        const invoice = {
            id: generateInvoiceId(),
            company: customer,
            services: services
        }
        
        // Validate invoice data before generation
        const errors: string[] = [];
        
        if (!customer.name) {
            errors.push('• Debe seleccionar un cliente');
        }
        
        if (services.every(s => !s.name || s.value <= 0)) {
            errors.push('• Debe agregar al menos un servicio válido');
        }
        
        if (services.some(s => s.name && s.value <= 0)) {
            errors.push('• Todos los servicios deben tener un valor mayor a 0');
        }

        if (errors.length > 0) {
            NotificationService.validationError(errors);
            return;
        }
        
        // Show loading notification
        const loadingToast = NotificationService.loading('Generando cuenta de cobro...');
        
        try {
            const invoiceNumber = await generateInvoice(invoice);
            
            // Update loading toast to success
            NotificationService.updateToast(loadingToast, 'success', 
                `✅ Cuenta de cobro ${invoiceNumber} generada exitosamente`);
            
            // Show additional success notification
            NotificationService.invoiceSaved();
            
        } catch (error) {
            console.error('Error generating invoice:', error);
            
            // Update loading toast to error
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            NotificationService.updateToast(loadingToast, 'error', 
                `❌ Error al generar la cuenta de cobro: ${errorMessage}`);
        }
    }

    const handleCustomer = (customerOption: SelectOption) => {
        const selectedCustomer = {
            name: customerOption.label,
            value: customerOption.value
        };
        console.log('Selected customer:', selectedCustomer);
        setCustomer(selectedCustomer);
        setServices([{ id: 0, name: '', value: 0 }]);
    }

    const handleServiceTemplate = (serviceOption: SelectOption) => {
        const selectedService = {
            name: serviceOption.label,
            value: serviceOption.value
        };
        setService(selectedService);

        const template = templates.find(t => t.name === serviceOption.label); 

        if(!template) return;

        setServices([{
            id: 0,
            name: template.description,
            value: template.company === customer.name ? template.value : 0
        }])
    }

    // Prepare options for customers
    const customerOptions: SelectOption[] = [
        {
            label: 'Ensafe SAS',
            value: '900392150-2'
        }, 
        {
            label: 'María Carolina Longlax Triana',
            value: '951976464'
        }, 
        {
            label: 'Urbanos Zonas De Creacion Y Construccion SAS',
            value: '900.180.604-4'
        }, 
        {
            label: 'Leidy Mayerly Oliveros Cobos',
            value: '1.024.514.405'
        }, 
        {
            label: 'PHASE TWO MEDIA INC',
            value: '847039435'
        }
    ];

    // Prepare options for services
    const serviceOptions: SelectOption[] = [
        {
            label: 'Manejo de redes',
            value: '0',
            description: 'Gestión y creación de contenido para redes sociales'
        }, 
        {
            label: 'Identidad Corporativa',
            value: '1',
            description: 'Diseño de logotipo, manual de marca y elementos gráficos'
        },
        {
            label: 'Página web',
            value: '2',
            description: 'Desarrollo y diseño de sitio web corporativo'
        }
    ];

    return (
        <div className="p-8">
            <div className="mx-auto space-y-8">
                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cliente</label>
                        <Select
                            id="customer"
                            value={customer.value}
                            options={customerOptions}
                            onValueChange={(option) => handleCustomer(option)}
                            placeholder="Selecciona un cliente"
                            searchable
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Plantilla de servicio</label>
                        <Select
                            id="service"
                            value={service.value}
                            options={serviceOptions}
                            onValueChange={(option) => handleServiceTemplate(option)}
                            placeholder="Selecciona un servicio"
                            searchable
                        />
                    </div>
                </div>

                {/* Services Table Section */}
                <div className="bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
                    </div>
                    
                    <ServicesTable services={services} setServices={setServices} />
                </div>

                {/* Generate Button */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <Button 
                        onClick={() => setShowHistory(true)} 
                        text="Ver historial"
                        size="md"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        iconPosition="left"
                        variant="secondary"
                    />
                    
                    <Button 
                        onClick={handleInvoice} 
                        text="Generar cuenta de cobro"
                        size="lg"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        iconPosition="left"
                        disabled={!customer.name || services.every(s => !s.name)}
                    />
                </div>
            </div>
            
            {/* Invoice History Modal */}
            <InvoiceHistory 
                isOpen={showHistory} 
                onClose={() => setShowHistory(false)} 
            />
            
            {/* Toast Notifications */}
            <ToastProvider />
        </div>
    )
}

export default InvoiceGenerator