import React, { useEffect } from 'react'
import Button from '../../../shared/ui/Button';
import NewQuotePopup from './NewQuotePopup';
import { deleteQuote, getQuotes, setCurrentQuote } from '../services/QuoteController';

function Quotes() {

    const [quotes, setQuotes] = React.useState([] as Quote[])
    const [openDetails, setOpenDetails] = React.useState(false)

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
                {quotes
                    .sort((a: Quote, b: Quote) => Number(b.number) - Number(a.number))
                    .map((quote: Quote) => (
                        <div 
                            className='flex justify-between w-full p-3 bg-white border border-gray-300 rounded-lg' 
                            key={quote.id}
                        >
                            <div className='w-full cursor-pointer' onClick={() => handleSetCurrentQuote(quote)}>
                                <h2 className='font-bold text-2xl'>{quote.client}</h2>
                            </div>
                            <div className='w-44 flex items-center gap-5 text-gray-600'>
                                <div>
                                    <div>{quote.date}</div>
                                    <small>{quote.number}</small>
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
        </div>
    )
}

export default Quotes