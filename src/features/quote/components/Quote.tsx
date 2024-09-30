import React, { useEffect } from 'react'
import Filters from './Filters'
import QuoteTable from './QuoteTable'
import Button from '../../../shared/ui/Button'
import { generateQuote } from '../../invoice/services/invoiceUtils'
import { emptyProduct } from '../constants/emptyProducts'
import { getQuote } from '../services/QuoteController'

function Quote() {

    const [currentQuote, setCurrentQuote] = React.useState({} as Quote)

    useEffect(() => {
        const quoteId = localStorage.getItem('currentQuote')

        if(quoteId){
            getQuote(quoteId).then((data) => {
                setCurrentQuote(data);
            });
        }

    }, [])

    const setDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentQuote({
            ...currentQuote,
            date: e.target.value
        })
    }

    const setNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentQuote({
            ...currentQuote,
            number: e.target.value
        })
    }

    const setClient = (value: string) => {
        setCurrentQuote({
            ...currentQuote,
            client: value
        })
    }

    const handleQuoteGenerator = () => {
        console.log(currentQuote)
        generateQuote(currentQuote)
    }

    return (
        <div className='flex flex-col gap-5'>
            <Filters 
                currentQuote={currentQuote} 
                setDate={setDate} 
                setNumber={setNumber}
                setClient={setClient}
            />
            <div className='overflow-scroll relative'>
                <QuoteTable currentQuote={currentQuote} setCurrentQuote={setCurrentQuote} />
            </div>
            <Button text='Generar cotización' onClick={handleQuoteGenerator} />
        </div>
    )
}

export default Quote