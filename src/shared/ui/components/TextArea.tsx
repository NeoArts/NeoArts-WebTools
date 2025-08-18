import React, { forwardRef } from 'react';

type TextAreaSize = 'sm' | 'md' | 'lg';
type TextAreaVariant = 'default' | 'error' | 'success';

interface TextAreaProps {
    id: string;
    label?: string;
    value?: string;
    labelPosition?: 'top' | 'left';
    placeholder?: string;
    onInput?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    required?: boolean;
    rows?: number;
    size?: TextAreaSize;
    variant?: TextAreaVariant;
    error?: string;
    helperText?: string;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    maxLength?: number;
    showCharCount?: boolean;
    className?: string;
}

const sizeStyles: Record<TextAreaSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
};

const variantStyles: Record<TextAreaVariant, string> = {
    default: `
        border-gray-300 bg-white text-gray-900
        focus:border-purple-500 focus:ring-purple-500
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

const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    id,
    label,
    value = '',
    labelPosition = 'top',
    placeholder,
    onInput,
    onChange,
    disabled = false,
    required = false,
    rows = 4,
    size = 'md',
    variant = 'default',
    error,
    helperText,
    resize = 'vertical',
    maxLength,
    showCharCount = false,
    className = ''
}, ref) => {
    const textAreaVariant = error ? 'error' : variant;
    const currentLength = value.length;
    
    const baseTextAreaStyles = `
        w-full border rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        placeholder:text-gray-400
    `;

    const textAreaClassName = `
        ${baseTextAreaStyles}
        ${sizeStyles[size]}
        ${variantStyles[textAreaVariant]}
        ${resizeStyles[resize]}
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
                <textarea
                    ref={ref}
                    id={id}
                    name={id}
                    rows={rows}
                    className={textAreaClassName}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange || onInput}
                    disabled={disabled}
                    required={required}
                    maxLength={maxLength}
                    aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                />
                
                {(showCharCount || maxLength) && (
                    <div className="mt-1 flex justify-between items-center">
                        <div></div>
                        <div className={`text-xs ${maxLength && currentLength > maxLength * 0.9 ? 'text-orange-600' : 'text-gray-500'}`}>
                            {showCharCount && (
                                <span>
                                    {currentLength}
                                    {maxLength && (
                                        <span>/{maxLength}</span>
                                    )}
                                    {!maxLength && <span> characters</span>}
                                </span>
                            )}
                        </div>
                    </div>
                )}
                
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

TextArea.displayName = 'TextArea';

export default TextArea;