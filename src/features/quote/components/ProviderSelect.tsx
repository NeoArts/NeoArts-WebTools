import React, { useEffect, useState, useRef } from 'react';
import type { Provider } from '../../providers/dtos/Provider';

interface ProviderSelectProps {
    value: string;
    onChange: (value: string) => void;
    onOpenCreateProvider: (providerName: string) => void;
    label?: string;
    labelPosition?: 'top' | 'left';
}

function ProviderSelect({ value, onChange, onOpenCreateProvider, label, labelPosition = 'top' }: ProviderSelectProps) {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load providers from localStorage
    useEffect(() => {
        const loadProviders = () => {
            const data = localStorage.getItem('providers');
            const loadedProviders: Provider[] = data ? JSON.parse(data) : [];
            setProviders(loadedProviders);
        };

        loadProviders();

        // Listen for storage changes (when a new provider is added)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'providers') {
                loadProviders();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom event (for same-tab updates)
        const handleCustomUpdate = () => loadProviders();
        window.addEventListener('providersUpdated', handleCustomUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('providersUpdated', handleCustomUpdate);
        };
    }, []);

    // Filter providers based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProviders(providers);
        } else {
            const filtered = providers.filter(provider =>
                provider.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProviders(filtered);
        }
    }, [searchTerm, providers]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelectProvider = (providerName: string) => {
        onChange(providerName);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleCreateProvider = () => {
        onOpenCreateProvider(searchTerm);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleInputClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const exactMatch = providers.find(p => p.name.toLowerCase() === searchTerm.toLowerCase());
    const showCreateOption = searchTerm.trim() !== '' && !exactMatch && filteredProviders.length === 0;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && labelPosition === 'top' && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            
            <div className="relative">
                {/* Selected value display / trigger */}
                <div
                    onClick={handleInputClick}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-between"
                >
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                        {value || 'Selecciona'}
                    </span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar proveedor..."
                                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Options list */}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map((provider) => (
                                    <div
                                        key={provider.id}
                                        onClick={() => handleSelectProvider(provider.name)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                                            value === provider.name ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{provider.name}</span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {(provider.discount * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : searchTerm.trim() === '' ? (
                                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    No hay proveedores registrados
                                </div>
                            ) : !showCreateOption ? (
                                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    No se encontraron resultados
                                </div>
                            ) : null}

                            {/* Create new provider option */}
                            {showCreateOption && (
                                <div
                                    onClick={handleCreateProvider}
                                    className="px-4 py-3 cursor-pointer bg-green-50 hover:bg-green-100 border-t border-green-200 transition-colors"
                                >
                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Crear "{searchTerm}"</span>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1 ml-7">
                                        Registrar nuevo proveedor
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProviderSelect;
