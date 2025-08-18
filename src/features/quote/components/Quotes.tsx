import React, { useEffect } from 'react'
import Button from '../../../shared/ui/components/Button';
import NewQuotePopup from './NewQuotePopup';
import { deleteQuote, downloadQuote, getQuotes, setCurrentQuote } from '../services/QuoteController';
import { exportToExcel } from '../services/ExcelServices';
import JsonUploader from './JsonUploader';
import { NotificationService } from '../../../shared/services/notifications';
import ToastProvider from '../../../shared/ui/components/ToastProvider';
import type { Quote } from '../dtos/Quote';

function Quotes() {

    const [quotes, setQuotes] = React.useState([] as Quote[])
    const [openDetails, setOpenDetails] = React.useState(false)
    const [selectedQuotes, setSelectedQuotes] = React.useState([] as Quote[])
    const [isCreatingBackup, setIsCreatingBackup] = React.useState(false)
    const baseUrl = import.meta.env.BASE_URL || '/';

    useEffect(() => {
        getQuotes().then((quotes) => {
            setQuotes(quotes)
        });
    }, [])

    const handleCreateNewQuote = () => {
        setOpenDetails(true)
    }

    const handleSetCurrentQuote = (quote: Quote) => {
        localStorage.setItem('currentQuote', quote.id);
        window.location.href = `${baseUrl}quote/quote-generator`
    }

    const handleDeleteQuote = (id: string) => {
        if(confirm("¿Estás segur@ de borrar esta cotización?"))
        {
            deleteQuote(id);
            NotificationService.success('Cotización eliminada exitosamente');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    const handleExport = (id: string) => {
        downloadQuote(id);
        NotificationService.success('Cotización exportada exitosamente');
    }

    const handleDelete = () => {
        if(confirm(`¿Estás segur@ de eliminar ${selectedQuotes.length} cotización${selectedQuotes.length > 1 ? 'es' : ''}?`)) {
            selectedQuotes.forEach(quote => {
                deleteQuote(quote.id);
            })

            NotificationService.success(`${selectedQuotes.length} cotización${selectedQuotes.length > 1 ? 'es' : ''} eliminada${selectedQuotes.length > 1 ? 's' : ''} exitosamente`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    const backupIndexedDB = (dbName: string) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
            
            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction(db.objectStoreNames, 'readonly');
                const backup: Record<string, any> = {};

                let pendingStores = db.objectStoreNames.length;

                for (const storeName of db.objectStoreNames) {
                    const objectStore = transaction.objectStore(storeName);
                    const getAllRequest = objectStore.getAll();

                    getAllRequest.onsuccess = () => {
                        backup[storeName] = getAllRequest.result;
                        pendingStores--;

                        if (pendingStores === 0) {
                            resolve(backup);
                        }
                    };

                    getAllRequest.onerror = () => reject(getAllRequest.error);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    const handleCreateBackup = async () => {
        setIsCreatingBackup(true);
        try {
            const backupData = await backupIndexedDB('QuotesDB');
            const currentDate = new Date().toISOString().split('T')[0];
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `neoarts-quotes-backup-${currentDate}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            NotificationService.success('Copia de seguridad creada exitosamente');
        } catch (error) {
            console.error('Error creating backup:', error);
            NotificationService.error('Error al crear la copia de seguridad');
        } finally {
            setIsCreatingBackup(false);
        }
    }

    return (
        <>
            <ToastProvider />
            <div className='space-y-6'>
                <NewQuotePopup
                    openDetails={openDetails}
                    setOpenDetails={setOpenDetails}
                />
                
                {/* Header Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
                            <p className="text-gray-600 mt-1">
                                {quotes.length === 0 ? 'No tienes cotizaciones creadas aún' : 
                                 `${quotes.length} cotización${quotes.length !== 1 ? 'es' : ''} ${quotes.length === 1 ? 'creada' : 'creadas'}`}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                text={isCreatingBackup ? 'Creando...' : 'Crear copia de seguridad'} 
                                onClick={handleCreateBackup}
                                disabled={isCreatingBackup || quotes.length === 0}
                                variant="secondary"
                                loading={isCreatingBackup}
                            />
                            <Button 
                                text='Nueva Cotización' 
                                onClick={handleCreateNewQuote}
                            />
                        </div>
                    </div>

                    {quotes.length === 0 ? (
                        <div className='flex w-full border-2 border-dashed border-gray-300 rounded-lg justify-center items-center h-48 bg-gray-50'>
                            <div className="text-center">
                                <div className="text-4xl mb-3">📋</div>
                                <p className="text-gray-600 font-medium">No tienes cotizaciones creadas aún</p>
                                <p className="text-gray-500 text-sm mt-1">Crea tu primera cotización para comenzar</p>
                            </div>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {/* Bulk Actions */}
                            {quotes.length > 0 && (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                checked={selectedQuotes.length === quotes.length}
                                                type="checkbox" 
                                                className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                                onChange={(e) => {
                                                    if(e.target.checked){
                                                        setSelectedQuotes(quotes)
                                                    } else {
                                                        setSelectedQuotes([])
                                                    }
                                                }}
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Seleccionar todas las cotizaciones
                                            </span>
                                        </label>
                                        {selectedQuotes.length > 0 && (
                                            <span className="text-sm text-purple-600 font-medium">
                                                {selectedQuotes.length} seleccionada{selectedQuotes.length !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    {selectedQuotes.length > 0 && (
                                        <Button 
                                            text={`Eliminar ${selectedQuotes.length} cotización${selectedQuotes.length !== 1 ? 'es' : ''}`} 
                                            onClick={handleDelete} 
                                            variant="danger"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Quotes List */}
                            <div className="space-y-3">
                                {quotes
                                    .sort((a: Quote, b: Quote) => Number(b.number) - Number(a.number))
                                    .map((quote: Quote) => (
                                        <div 
                                            className='flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200' 
                                            key={quote.id}
                                        >
                                            {/* Checkbox */}
                                            <div className="flex-shrink-0">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2" 
                                                    checked={selectedQuotes.some(selectedQuote => selectedQuote.id === quote.id)}
                                                    onChange={(e) => {
                                                        if(e.target.checked){
                                                            setSelectedQuotes([...selectedQuotes, quote])
                                                        } else {
                                                            setSelectedQuotes(selectedQuotes.filter(selectedQuote => selectedQuote.id !== quote.id))
                                                        }
                                                    }} 
                                                />
                                            </div>

                                            {/* Quote Info - Clickable */}
                                            <div className='flex-1 cursor-pointer min-w-0' onClick={() => handleSetCurrentQuote(quote)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className='font-bold text-lg text-gray-900 truncate'>{quote.client}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className='text-sm text-gray-600'>{quote.date}</span>
                                                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                                                                #{quote.number}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Clic para editar</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className='flex items-center gap-2 flex-shrink-0'>
                                                <button
                                                    className='flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                                                    onClick={() => handleExport(quote.id)}
                                                    title="Exportar cotización"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className='flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                                                    onClick={() => handleDeleteQuote(quote.id)}
                                                    title="Eliminar cotización"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* JSON Uploader Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Importar Cotizaciones</h2>
                    <JsonUploader />
                </div>
            </div>
        </>
    )
}

export default Quotes