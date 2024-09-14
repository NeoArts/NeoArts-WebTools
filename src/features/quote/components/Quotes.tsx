import React, { useEffect } from 'react'
import Button from '../../../shared/ui/Button';
import NewQuotePopup from './NewQuotePopup';

function Quotes() {

    const [quotes, setQuotes] = React.useState([] as Quote[])
    const [openDetails, setOpenDetails] = React.useState(false)

    useEffect(() => {
        const savedQuotes = localStorage.getItem('quotes')
        
        if(!savedQuotes || JSON.parse(savedQuotes).length === 0) return;
        
        setQuotes(JSON.parse(savedQuotes))
    }, [])

    const handleCreateNewQuote = () => {
        setOpenDetails(true)
    }

    const handleSetCurrentQuote = (quote: Quote) => {
        console.log(JSON.stringify(quote))
        localStorage.setItem('currentQuote', JSON.stringify(quote))
        
        window.location.href = '/quote-generator'
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
                            className='cursor-pointer p-3 bg-white border border-gray-300 rounded-lg' 
                            key={quote.id}
                            onClick={() => handleSetCurrentQuote(quote)}
                        >
                            <div className='flex w-full justify-between'>
                                <h2 className='font-bold text-2xl'>{quote.client}</h2>
                                <div>{quote.date}</div>
                            </div>
                            <div className='flex w-full justify-end text-gray-600'>
                                <small>{quote.number}</small>
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