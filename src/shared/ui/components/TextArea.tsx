import React from 'react'

function Input( 
    { id, value, label, labelPosition, placeholder, onInput } : 
    { 
        id: string, 
        label?: string,
        value?: string, 
        labelPosition?: 'top' | 'left',
        placeholder?: string,
        onInput?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    }
) 
{
    return (
        <div className={`flex gap-2 ${labelPosition === 'top' ? "flex-col" : "flex-row items-center"}`}>
            {label && <label htmlFor={id}>{label}:</label>}
            <textarea 
                id={id}
                name={id}
                className="w-full border-none py-3 bg-white rounded-md p-2 focus:outline-none"
                value={value}
                placeholder={placeholder}
                onChange={onInput}
            />
        </div>
    )
}

export default Input