import React, { useEffect } from 'react'
import Button from '../../../shared/ui/Button'
import Filters from './Filters'
import { createNewQuote } from '../services/QuoteController'

function NewQuotePopup( { openDetails, setOpenDetails } : { openDetails: boolean, setOpenDetails: React.Dispatch<React.SetStateAction<boolean>> }) {
    
    const [quote, setQuote] = React.useState({
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString().split("T")[0],
        number: '',
        client: '',
        products: [{ id: 0 }]
    } as Quote)

    useEffect(() => {
        const savedQuotes = localStorage.getItem('quotes')
        
        if(!savedQuotes || JSON.parse(savedQuotes).length === 0) return;
        
        const lastQuote = JSON.parse(savedQuotes).sort((a: Quote, b: Quote) => Number(b.number) - Number(a.number))[0]
        setQuote({
            ...quote,
            number: (Number(lastQuote.number) + 1).toString()
        })
        
    }, [])

    const setDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuote({
            ...quote,
            date: e.target.value
        })
    }

    const setNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuote({
            ...quote,
            number: e.target.value
        })
    }

    const setClient = (value: string) => {
        setQuote({
            ...quote,
            client: value
        })
    }

    const saveToLocalStorage = () => {
        createNewQuote(quote)
        .then((result) => {
            window.location.reload()
        })
        .catch((e) => {
            console.log(e);
            alert('Ha ocurrido un error, por favor vuelve a intentar')
        })
    }
    
    return (
        <div id="details-modal" tabIndex={-1} aria-hidden="true" className={`${!openDetails && "hidden"} overflow-y-auto overflow-x-hidden bg-opacity-80 bg-black fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-100">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                            Datos nueva cotización
                        </h3>
                        <div className='flex items-center gap-5'>
                            <button 
                                type="button" 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                                data-modal-hide="details-modal"
                                onClick={() => setOpenDetails(false)}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-4 md:p-5 space-y-4 h-[50vh] overflow-scroll">
                        <Filters
                            currentQuote={quote}
                            setDate={setDate}
                            setClient={setClient}
                            setNumber={setNumber}
                            vertical={true}
                        />
                    </div>
                    <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <Button text={`Crear`} onClick={() => saveToLocalStorage()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewQuotePopup