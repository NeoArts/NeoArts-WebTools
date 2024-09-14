import React, { useEffect } from 'react'
import Filters from './Filters'
import QuoteTable from './QuoteTable'
import Button from '../../../shared/ui/Button'
import { generateQuote } from '../../invoice/services/invoiceUtils'
import { emptyProduct } from '../constants/emptyProducts'

function Quote() {

    const [currentQuote, setCurrentQuote] = React.useState({} as Quote)

    useEffect(() => {
        const currentQuote = localStorage.getItem('currentQuote')

        if(currentQuote) {
            const quote = JSON.parse(currentQuote)
            console.log(quote)
            if(quote.products.length === 0) {
                quote.products.push(emptyProduct)
            }

            setCurrentQuote(quote)
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
            <div className='h-[calc(100vh-240px)] overflow-scroll'>
                <QuoteTable currentQuote={currentQuote} setCurrentQuote={setCurrentQuote} />
            </div>
            <Button text='Generar cotización' onClick={handleQuoteGenerator} />
        </div>
    )
}

export default Quote