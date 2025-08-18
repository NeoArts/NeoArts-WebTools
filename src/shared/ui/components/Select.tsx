import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
    label: string;
    value: any;
    disabled?: boolean;
    icon?: React.ReactNode;
    description?: string;
}

interface SelectProps {
    id: string;
    label?: string;
    value?: any;
    options: SelectOption[];
    onValueChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    helperText?: string;
    size?: 'sm' | 'md' | 'lg';
    labelPosition?: 'top' | 'left';
    searchable?: boolean;
    clearable?: boolean;
    className?: string;
}

const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-3 py-2 text-sm min-h-[40px]',
    lg: 'px-4 py-3 text-base min-h-[48px]'
};

export default function Select({
    id,
    label,
    value,
    options,
    onValueChange,
    placeholder = 'Select an option...',
    disabled = false,
    required = false,
    error,
    helperText,
    size = 'md',
    labelPosition = 'top',
    searchable = false,
    clearable = false,
    className = ''
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    const filteredOptions = searchable && searchTerm
        ? options.filter(option => 
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : options;

    // Get selected option(s) for display
    const getSelectedOption = () => {
        return options.find(option => option.value === value);
    };

    const selectedOption = getSelectedOption();

    // Handle option selection
    const handleSelect = (option: SelectOption) => {
        if (option.disabled) return;
        
        onValueChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    // Handle clear selection
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onValueChange(undefined);
        setSearchTerm('');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const baseStyles = `
        w-full border rounded-lg transition-all duration-200 bg-white
        focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600
        hover:border-gray-400
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
    `;

    const triggerClassName = `
        ${baseStyles}
        ${sizeStyles[size]}
        cursor-pointer flex items-center justify-between gap-2
        ${disabled ? 'cursor-not-allowed' : ''}
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

    const renderSelectedValue = () => {
        if (selectedOption && !Array.isArray(selectedOption)) {
            return (
                <div className="flex items-center gap-2">
                    {selectedOption.icon && (
                        <span className="flex-shrink-0">{selectedOption.icon}</span>
                    )}
                    <span>{selectedOption.label}</span>
                </div>
            );
        }
        
        return <span className="text-gray-400">{placeholder}</span>;
    };

    return (
        <div className={containerClassName}>
            {label && (
                <label htmlFor={id} className={labelClassName}>
                    {label}:
                </label>
            )}
            
            <div className="w-full relative" ref={selectRef}>
                <div
                    className={triggerClassName}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    tabIndex={disabled ? -1 : 0}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                >
                    <div className="flex-1 truncate">
                        {renderSelectedValue()}
                    </div>
                    
                    <div className="flex items-center gap-1">
                        {clearable && value !== undefined && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                tabIndex={-1}
                            >
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                        {searchable && (
                            <div className="p-2 border-b border-gray-200">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search options..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>
                        )}
                        
                        <div className="max-h-48 overflow-y-auto" role="listbox">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    {searchTerm ? 'No options found' : 'No options available'}
                                </div>
                            ) : (
                                filteredOptions.map((option, index) => {
                                    const isSelected = value === option.value;
                                    
                                    return (
                                        <div
                                            key={`${option.value}-${index}`}
                                            className={`
                                                px-3 py-2 cursor-pointer transition-colors flex items-center gap-2
                                                ${isSelected ? 'bg-red-100 text-red-700' : 'text-gray-900'}
                                                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                                            `}
                                            onClick={() => handleSelect(option)}
                                            role="option"
                                            aria-selected={isSelected}
                                        >
                                            {option.icon && (
                                                <span className="flex-shrink-0">{option.icon}</span>
                                            )}
                                            
                                            <div className="flex-1">
                                                <div className="font-medium">{option.label}</div>
                                                {option.description && (
                                                    <div className="text-sm text-gray-500">{option.description}</div>
                                                )}
                                            </div>
                                            
                                            {isSelected && (
                                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    );
                                })
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
}
