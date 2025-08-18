import React from 'react'

type Option = {
    name: string,
    value: string,
}

function Dropdown(
    { options, label, id, labelPosition, value, setValue, placeholder, className } : 
    { 
        options: Option[],
        id: string,
        label?: string,
        labelPosition?: 'top' | 'left'
        value: string,
        setValue: (e: any) => void,
        placeholder?: string,
        className?: string
    }
) {


    const [open, setOpen] = React.useState(false)
    const baseUrl = import.meta.env.BASE_URL || '/';

    return (
        <div className={`${className} w-full relative z-10 gap-2 ${labelPosition === 'top' ? "flex-col" : "flex-row items-center"}`}>
            {label && <label htmlFor={id}>{label}:</label>}
            <div 
                className={`${label && "mt-2"} w-full flex items-center p-2 cursor-pointer bg-white rounded-md`}
                onClick={() => setOpen(!open)}
            >
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    className='cursor-pointer bg-white focus:outline-none w-full border-none'
                    onChange={(e:any) => setValue(e.target.value)}
                />
                <img 
                    src={`${baseUrl}icons/DropArrow.svg`} 
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
                                {option.name}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Dropdown