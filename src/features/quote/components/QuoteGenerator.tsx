import React from 'react'
import Filters from './Filters'
import QuoteTable from './QuoteTable'
import Button from '../../../shared/ui/Button'
import { generateInvoice, generateQuote } from '../../invoice/services/invoiceUtils'

function QuoteGenerator() {

    const [products, setProducts] = React.useState([{ 
        id: 0,
        name: '',
        markCost: 0,
        markType: '',
        otherCost: 0,
        price: 0,
        profit: 0,
        provider: '',
        providerDiscount: 0,
        quantity: 0,
        sellPrice: 0,
        totalCost: 0,
        totalValue: 0,
        image: { base64String: '', height: 0 },
        unitPrice: 0
    }])

    const [quoteGeneralData, setQuoteGeneralData] = React.useState({
        date: new Date().toISOString().split("T")[0],
        number: '',
        client: ''
    })

    const setDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuoteGeneralData({
            ...quoteGeneralData,
            date: e.target.value
        })
    }

    const setNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuoteGeneralData({
            ...quoteGeneralData,
            number: e.target.value
        })
    }

    const setClient = (value: string) => {
        setQuoteGeneralData({
            ...quoteGeneralData,
            client: value
        })
    }

    const handleQuoteGenerator = () => {
        generateQuote(quoteGeneralData, products)
    }

    return (
        <div className='flex flex-col gap-5'>
            <Filters 
                quoteGeneralData={quoteGeneralData} 
                setDate={setDate} 
                setNumber={setNumber}
                setClient={setClient}
            />
            <div className='h-[calc(100vh-240px)] overflow-scroll'>
                <QuoteTable products={products} setProducts={setProducts} />
            </div>
            <Button text='Generar cotización' onClick={handleQuoteGenerator} />
        </div>
    )
}

export default QuoteGenerator