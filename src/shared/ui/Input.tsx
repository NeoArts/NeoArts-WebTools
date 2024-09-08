import React from 'react'

function Input( 
    { id, type, value, label, labelPosition, placeholder, onInput, disabled, max, min } : 
    { 
        id: string, 
        type: string, 
        label?: string,
        value?: string, 
        labelPosition?: 'top' | 'left',
        placeholder?: string,
        onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void,
        disabled?: boolean,
        max?: number,
        min?: number
    }
) 
{
    return (
        <div className={`flex gap-2 ${labelPosition === 'top' ? "flex-col" : "flex-row items-center"}`}>
            {label && <label htmlFor={id}>{label}:</label>}
            <input 
                id={id}
                name={id}
                type={type}
                max={max}
                min={min}
                className="w-full border-none content-height py-3 bg-white rounded-md p-2 focus:outline-none"
                value={value}
                placeholder={placeholder}
                onChange={onInput}
                disabled={disabled}
            />
        </div>
    )
}

export default Input