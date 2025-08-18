import React from 'react';
import Button from '../../../shared/ui/components/Button';
import ToastProvider from '../../../shared/ui/components/ToastProvider';
import { NotificationService } from '../../../shared/services/notifications';

const NotificationDemo: React.FC = () => {
    const demoSuccess = () => {
        NotificationService.success('¡Operación completada exitosamente!');
    };

    const demoError = () => {
        NotificationService.error('Ocurrió un error inesperado');
    };

    const demoWarning = () => {
        NotificationService.warning('Advertencia: Revisa esta información');
    };

    const demoInfo = () => {
        NotificationService.info('Información importante para el usuario');
    };

    const demoLoading = () => {
        const toastId = NotificationService.loading('Procesando datos...');
        
        // Simulate async operation
        setTimeout(() => {
            NotificationService.updateToast(toastId, 'success', '¡Datos procesados correctamente!');
        }, 3000);
    };

    const demoPromise = () => {
        const fakePromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.5 ? resolve('Success!') : reject('Error!');
            }, 2000);
        });

        NotificationService.promise(fakePromise, {
            loading: 'Guardando datos...',
            success: '¡Datos guardados correctamente!',
            error: 'Error al guardar los datos'
        });
    };

    const demoInvoice = () => {
        NotificationService.invoiceGenerated('NC-2025-001');
    };

    const demoValidation = () => {
        NotificationService.validationError([
            'El campo nombre es requerido',
            'El email debe tener un formato válido',
            'La contraseña debe tener al menos 8 caracteres'
        ]);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Demostración de Notificaciones
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button onClick={demoSuccess} text="Éxito" variant="success" size="md" />
                <Button onClick={demoError} text="Error" variant="danger" size="md" />
                <Button onClick={demoWarning} text="Advertencia" variant="secondary" size="md" />
                <Button onClick={demoInfo} text="Información" variant="primary" size="md" />
                <Button onClick={demoLoading} text="Cargando" variant="tertiary" size="md" />
                <Button onClick={demoPromise} text="Promesa" variant="primary" size="md" />
                <Button onClick={demoInvoice} text="Factura" variant="success" size="md" />
                <Button onClick={demoValidation} text="Validación" variant="danger" size="md" />
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Características</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Diseño hermoso y moderno con react-hot-toast</li>
                    <li>Diferentes tipos: éxito, error, advertencia, información</li>
                    <li>Notificaciones de carga con actualización automática</li>
                    <li>Soporte para promesas con estados automáticos</li>
                    <li>Notificaciones específicas para el negocio (facturas, validaciones)</li>
                    <li>Estilos personalizados con colores y tipografía consistentes</li>
                    <li>Posicionamiento configurable y duración personalizable</li>
                    <li>Iconos automáticos y emojis para mejor UX</li>
                </ul>
            </div>

            <ToastProvider />
        </div>
    );
};

export default NotificationDemo;
