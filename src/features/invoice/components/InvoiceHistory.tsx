import React, { useEffect, useState } from 'react';
import { invoiceStorage, type StoredInvoice } from '../services/invoiceStorage';

interface InvoiceHistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ isOpen, onClose }) => {
    const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadInvoices();
        }
    }, [isOpen]);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const allInvoices = await invoiceStorage.getAllInvoices();
            setInvoices(allInvoices);
        } catch (error) {
            console.error('Error loading invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getTotalValue = (services: { value: number }[]) => {
        return services.reduce((acc, service) => acc + service.value, 0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Historial de Cuentas de Cobro</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-y-auto max-h-[70vh]">
                        {invoices.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p>No hay cuentas de cobro registradas</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-blue-600">
                                                        {invoice.invoiceNumber}
                                                    </span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                        {invoice.year}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-gray-900 mb-1">
                                                    {invoice.company.name}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {invoice.company.value.includes("-") ? "NIT" : "CC"}: {invoice.company.value}
                                                </p>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Servicios:</span>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {invoice.services.map((service, index) => (
                                                            <li key={index}>
                                                                {service.name} - {formatCurrency(service.value)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-green-600">
                                                    {formatCurrency(getTotalValue(invoice.services))}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(invoice.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Total: {invoices.length} cuenta{invoices.length !== 1 ? 's' : ''} de cobro
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceHistory;
