import React, { useEffect } from 'react'
import Input from '../../../shared/ui/Input'
import Dropdown from '../../../shared/ui/Dropdown'

function Filters({ quoteGeneralData, setDate, setClient, setNumber } : { quoteGeneralData: any, setDate: any, setClient: any, setNumber: any }) {
    
    useEffect(() => {
        console.log(quoteGeneralData)
    }, [quoteGeneralData])

    return (
        <form className="flex items-start gap-2">
            <div className='w-64'>
                <Input
                    type="date"
                    label="Fecha"
                    id="quote-date"
                    value={quoteGeneralData.date}
                    labelPosition="top"
                    onInput={setDate}
                />
            </div>
            <div className='w-64'>
                <Input
                    type="text"
                    label="Cotización"
                    id="quote-number"
                    labelPosition="top"
                    placeholder='000-000-000'
                    value={quoteGeneralData.number}
                    onInput={setNumber}
                />
            </div>
            <div className='w-64'>
                {/* <Dropdown 
                    options={["CASA LUKER"]} 
                    label="Cliente"
                    id="quote-client"
                    labelPosition="top"
                    value={quoteGeneralData.client}
                    setValue={setClient}
                /> */}
                <Input
                    type="text"
                    label="Cliente"
                    id="quote-client"
                    labelPosition="top"
                    value={quoteGeneralData.client}
                    onInput={(e: any) => setClient(e.target.value)}
                />
            </div>
        </form>
    )
}

export default Filters