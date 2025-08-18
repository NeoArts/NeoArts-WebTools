import React, { forwardRef } from 'react';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'error' | 'success';

interface InputProps {
    id: string;
    type: string;
    label?: string;
    value?: string;
    labelPosition?: 'top' | 'left';
    placeholder?: string;
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    max?: number;
    min?: number;
    size?: InputSize;
    variant?: InputVariant;
    error?: string;
    helperText?: string;
    required?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-3 py-2 text-sm min-h-[40px]',
    lg: 'px-4 py-3 text-base min-h-[48px]'
};

const variantStyles: Record<InputVariant, string> = {
    default: `
        border-gray-300 bg-white text-gray-900
        focus:border-black focus:ring-black
        hover:border-gray-400
    `,
    error: `
        border-red-300 bg-white text-gray-900
        focus:border-red-500 focus:ring-red-500
        hover:border-red-400
    `,
    success: `
        border-green-300 bg-white text-gray-900
        focus:border-green-500 focus:ring-green-500
        hover:border-green-400
    `
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
    id,
    type,
    label,
    value,
    labelPosition = 'top',
    placeholder,
    onInput,
    onChange,
    disabled = false,
    max,
    min,
    size = 'md',
    variant = 'default',
    error,
    helperText,
    required = false,
    icon,
    iconPosition = 'left',
    className = ''
}, ref) => {
    const inputVariant = error ? 'error' : variant;
    
    const baseInputStyles = `
        w-full border rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        placeholder:text-gray-400
    `;

    const inputClassName = `
        ${baseInputStyles}
        ${sizeStyles[size]}
        ${variantStyles[inputVariant]}
        ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
        ${className}
    `.replace(/\s+/g, ' ').trim();

    const containerClassName = `
        w-full flex gap-2 
        ${labelPosition === 'top' ? 'flex-col' : 'flex-row items-start'}
    `;

    const labelClassName = `
        text-sm font-medium text-gray-700
        ${labelPosition === 'left' ? 'min-w-fit whitespace-nowrap mt-2' : ''}
        ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
    `;

    return (
        <div className={containerClassName}>
            {label && (
                <label htmlFor={id} className={labelClassName}>
                    {label}:
                </label>
            )}
            
            <div className="w-full">
                <div className="relative">
                    {icon && iconPosition === 'left' && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {icon}
                        </div>
                    )}
                    
                    <input
                        ref={ref}
                        id={id}
                        name={id}
                        type={type}
                        max={max}
                        min={min}
                        className={inputClassName}
                        value={value}
                        placeholder={placeholder}
                        onChange={onChange || onInput}
                        disabled={disabled}
                        required={required}
                        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                        aria-invalid={error ? 'true' : 'false'}
                    />
                    
                    {icon && iconPosition === 'right' && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                            {icon}
                        </div>
                    )}
                </div>
                
                {error && (
                    <p id={`${id}-error`} className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
                
                {helperText && !error && (
                    <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    );
});

Input.displayName = 'Input';

export default Input;