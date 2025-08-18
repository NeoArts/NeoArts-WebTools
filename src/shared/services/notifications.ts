import toast from 'react-hot-toast';
import { notificationStorage } from './notificationStorage';

// Custom toast notifications with predefined styles and messages
export class NotificationService {
    
    // Helper method to save notification to IndexedDB
    private static async saveToStorage(
        title: string, 
        message: string, 
        type: 'success' | 'error' | 'warning' | 'info',
        category?: 'invoice' | 'quote' | 'provider' | 'post' | 'system',
        actionUrl?: string
    ) {
        try {
            await notificationStorage.addNotification({
                title,
                message,
                type,
                category,
                actionUrl
            });
        } catch (error) {
            console.error('Failed to save notification to storage:', error);
        }
    }

    // Success notifications
    static success(message: string, options?: any) {
        this.saveToStorage('Éxito', message, 'success', 'system');
        return toast.success(message, {
            duration: 4000,
            ...options
        });
    }

    // Error notifications
    static error(message: string, options?: any) {
        this.saveToStorage('Error', message, 'error', 'system');
        return toast.error(message, {
            duration: 5000,
            ...options
        });
    }

    // Loading notifications
    static loading(message: string = 'Procesando...', options?: any) {
        return toast.loading(message, {
            ...options
        });
    }

    // Generic notifications
    static info(message: string, options?: any) {
        this.saveToStorage('Información', message, 'info', 'system');
        return toast(message, {
            icon: 'ℹ️',
            style: {
                background: '#eff6ff',
                color: '#1e40af',
                border: '1px solid #bfdbfe',
            },
            duration: 4000,
            ...options
        });
    }

    // Warning notifications
    static warning(message: string, options?: any) {
        this.saveToStorage('Advertencia', message, 'warning', 'system');
        return toast(message, {
            icon: '⚠️',
            style: {
                background: '#fffbeb',
                color: '#d97706',
                border: '1px solid #fed7aa',
            },
            duration: 4500,
            ...options
        });
    }

    // Dismiss a specific toast
    static dismiss(toastId?: string) {
        return toast.dismiss(toastId);
    }

    // Dismiss all toasts
    static dismissAll() {
        return toast.dismiss();
    }

    // Promise-based notifications (useful for async operations)
    static promise<T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        },
        options?: any
    ) {
        return toast.promise(promise, messages, {
            loading: {
                style: {
                    background: '#fefce8',
                    color: '#a16207',
                    border: '1px solid #fde047',
                },
            },
            success: {
                style: {
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                },
            },
            error: {
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                },
            },
            ...options
        });
    }

    // Invoice-specific notifications
    static invoiceGenerated(invoiceNumber: string) {
        this.saveToStorage(
            'Cuenta de Cobro Generada', 
            `La cuenta de cobro ${invoiceNumber} ha sido generada exitosamente`,
            'success',
            'invoice',
            '/invoice'
        );
        return this.success(
            `✅ Cuenta de cobro ${invoiceNumber} generada exitosamente`,
            {
                duration: 6000,
                style: {
                    fontSize: '15px',
                    fontWeight: '500',
                }
            }
        );
    }

    static invoiceError(error?: string) {
        this.saveToStorage(
            'Error en Cuenta de Cobro',
            `Error al generar la cuenta de cobro${error ? `: ${error}` : ''}`,
            'error',
            'invoice'
        );
        return this.error(
            `❌ Error al generar la cuenta de cobro${error ? `: ${error}` : '. Por favor, intente nuevamente.'}`,
            {
                duration: 6000,
            }
        );
    }

    static invoiceSaved() {
        this.saveToStorage(
            'Cuenta de Cobro Guardada',
            'La cuenta de cobro ha sido guardada en el historial',
            'success',
            'invoice',
            '/invoice'
        );
        return this.success('💾 Cuenta de cobro guardada en el historial');
    }

    // Validation notifications
    static validationError(errors: string[]) {
        const errorMessage = errors.length === 1 
            ? errors[0] 
            : `Por favor corrige los siguientes errores:\n${errors.join('\n')}`;
        
        return this.error(errorMessage, {
            duration: 7000,
            style: {
                whiteSpace: 'pre-line',
                maxWidth: '500px',
            }
        });
    }

    // Custom business-specific notifications
    static dataLoaded(itemCount: number, itemType: string = 'elementos') {
        return this.success(
            `📊 ${itemCount} ${itemType} cargados exitosamente`,
            {
                duration: 3000,
            }
        );
    }

    static dataSaved(itemType: string = 'datos') {
        return this.success(
            `💾 ${itemType} guardados correctamente`,
            {
                duration: 3000,
            }
        );
    }

    static operationCancelled() {
        return this.info('❌ Operación cancelada');
    }

    // Update a loading toast to success or error
    static updateToast(toastId: string, type: 'success' | 'error', message: string) {
        if (type === 'success') {
            return toast.success(message, { id: toastId });
        } else {
            return toast.error(message, { id: toastId });
        }
    }
}

// Export individual functions for convenience
export const {
    success,
    error,
    loading,
    info,
    warning,
    dismiss,
    dismissAll,
    promise: promiseToast,
    invoiceGenerated,
    invoiceError,
    invoiceSaved,
    validationError,
    dataLoaded,
    dataSaved,
    operationCancelled,
    updateToast
} = NotificationService;
