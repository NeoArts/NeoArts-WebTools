import React from 'react'

function Dropdown(
    { options, label, id, labelPosition, value, setValue, placeholder } : 
    { 
        options: string[],
        id: string,
        label?: string,
        labelPosition?: 'top' | 'left'
        value: string,
        setValue: (e: any) => void,
        placeholder?: string
    }
) {


    const [open, setOpen] = React.useState(false)

    return (
        <div className={`w-full relative z-10 gap-2 ${labelPosition === 'top' ? "flex-col" : "flex-row items-center"}`}>
            {label && <label htmlFor={id}>{label}:</label>}
            <div 
                className='flex justify-between items-center p-2 cursor-pointer bg-white rounded-md'
                onClick={() => setOpen(!open)}
            >
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    className='cursor-pointer max-w-48 bg-white focus:outline-none'
                    onChange={(e:any) => setValue(e.target.value)}
                />
                <img 
                    src="/icons/DropArrow.svg" 
                    alt="dropdown arrow" 
                    className='w-8'
                />
            </div>
            <div className='relative w-full' onBlur={() => setOpen(false)} >
                <div className={`${open ? "visible" : "hidden"} border shadow-xl rounded-lg transition-all overflow-hidden absolute top-0 w-full`}>
                    {
                        options.map((option, index) => (
                            <div 
                                key={index} 
                                className='p-2 cursor-pointer bg-white hover:bg-gray-100'
                                onClick={() => {
                                    setValue(option)
                                    setOpen(false)
                                }}
                            >
                                {option}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Dropdown