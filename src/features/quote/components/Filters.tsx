import React from 'react'
import Input from '../../../shared/ui/Input'
import Dropdown from '../../../shared/ui/Dropdown'

function Filters() {
    return (
        <form className="flex items-start gap-2">
            <Input
                type="date"
                label="Fecha"
                id="quote-date"
                value={new Date().toISOString().split("T")[0]}
                labelPosition="top"
            />
            <Input
                type="text"
                label="Cotización"
                id="quote-number"
                labelPosition="top"
                placeholder='000-000-000'
            />
            <Dropdown 
                options={["CASA LUKER"]} 
                label="Cliente"
                id="quote-client"
                labelPosition="top"
                value="CASA LUKER"
                setValue={() => {}}
            />
        </form>
    )
}

export default Filters