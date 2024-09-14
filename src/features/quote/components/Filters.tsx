import Input from '../../../shared/ui/Input'

function Filters({ currentQuote, setDate, setClient, setNumber, vertical } : { currentQuote: any, setDate: any, setClient: any, setNumber: any, vertical?: boolean }) {
    return (
        <form className={`flex ${vertical && "flex-col"} items-start gap-2`}>
            <div className={`${vertical ? "w-full" : "w-64"}`}>
                <Input
                    type="date"
                    label="Fecha"
                    id="quote-date"
                    value={currentQuote?.date}
                    labelPosition="top"
                    onInput={setDate}
                />
            </div>
            <div className={`${vertical ? "w-full" : "w-64"}`}>
                <Input
                    type="text"
                    label="Cotización"
                    id="quote-number"
                    labelPosition="top"
                    placeholder='000-000-000'
                    value={currentQuote?.number}
                    onInput={setNumber}
                />
            </div>
            <div className={`${vertical ? "w-full" : "w-64"}`}>
                <Input
                    type="text"
                    label="Cliente"
                    id="quote-client"
                    labelPosition="top"
                    value={currentQuote?.client}
                    onInput={(e: any) => setClient(e.target.value)}
                />
            </div>
        </form>
    )
}

export default Filters