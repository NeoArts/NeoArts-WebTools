import React, { useEffect } from 'react'
import Button from '../../../shared/ui/components/Button';
import NewQuotePopup from './NewQuotePopup';
import { deleteQuote, downloadQuote, getQuotes, setCurrentQuote } from '../services/QuoteController';
import { exportToExcel } from '../services/ExcelServices';
import JsonUploader from './JsonUploader';
import { Checkbox } from 'flowbite-react';

function Quotes() {

    const [quotes, setQuotes] = React.useState([] as Quote[])
    const [openDetails, setOpenDetails] = React.useState(false)
    const [selectedQuotes, setSelectedQuotes] = React.useState([] as Quote[])

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
        window.location.href = `/quote/quote-generator`
    }

    const handleDeleteQuote = (id: string) => {
        if(confirm("Estás segur@ de borrar esta cotización"))
        {
            deleteQuote(id);
            window.location.reload();
        }
    }

    const handleExport = (id: string) => {
        downloadQuote(id);
    }

    const handleDelete = () => {
        selectedQuotes.forEach(quote => {
            deleteQuote(quote.id);
        })

        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    return (
        <div className='flex gap-3 flex-col'>
            <NewQuotePopup
                openDetails={openDetails}
                setOpenDetails={setOpenDetails}
            />
            {quotes.length === 0 ? 
            <div className='flex w-full border border-dashed border-gray-500 rounded-lg justify-center items-center h-48'>
                <p>No tienes cotizaciones creadas aún</p>
            </div> :
            <div className='flex flex-col gap-5'>
                <div>
                    <Button 
                        text='Eliminar cotizaciones seleccionadas' 
                        onClick={() => handleDelete()} 
                        disabled={selectedQuotes.length === 0}
                    />
                    <div className="flex items-center mt-10">
                        <input 
                            checked={selectedQuotes.length === quotes.length}
                            id="checked-checkbox" 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={(e) => {
                                if(e.target.checked){
                                    setSelectedQuotes(quotes)
                                } else {
                                    setSelectedQuotes([])
                                }
                            }}
                        />
                        <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Seleccionar todas las cotizaciones</label>
                    </div>
                </div>
                {quotes
                    .sort((a: Quote, b: Quote) => Number(b.number) - Number(a.number))
                    .map((quote: Quote) => (
                        <div 
                            className='flex justify-between w-full p-3 bg-white border border-gray-300 rounded-lg' 
                            key={quote.id}
                        >
                            <div>
                                <input 
                                    type="checkbox" 
                                    className="mr-2" 
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
                            <div className='w-full cursor-pointer' onClick={() => handleSetCurrentQuote(quote)}>
                                <h2 className='font-bold text-2xl'>{quote.client}</h2>
                            </div>
                            <div className='w-96 flex items-center gap-5 text-gray-600'>
                                <div>
                                    <div>{quote.date}</div>
                                    <small>{quote.number}</small>
                                </div>
                                <div>
                                    <div 
                                        className='p-1 px-3 bg-green-500 text-white font-bold cursor-pointer'
                                        onClick={() => handleExport(quote.id)}
                                    >
                                        Exportar
                                    </div>
                                </div>
                                <div>
                                    <div 
                                        className='p-1 bg-black w-8 cursor-pointer'
                                        onClick={() => handleDeleteQuote(quote.id)}
                                    >
                                        <img src="icons/trash.svg" alt="" />
                                    </div>
                                </div> 
                            </div>
                        </div>
                    ))}
            </div>
            }
            <div>
                <Button text='Crear Nueva cotización' onClick={() => handleCreateNewQuote()} />
            </div>
            <div className='my-10'>
                <JsonUploader />
            </div>
        </div>
    )
}

export default Quotes