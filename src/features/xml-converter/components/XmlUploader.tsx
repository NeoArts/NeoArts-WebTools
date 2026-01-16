import React, { useRef, useState } from 'react';
import type { UploadedXmlFile } from '../dtos/XmlConverter';
import { XmlConverterService } from '../services/XmlConverterService';
import { NotificationService } from '../../../shared/services/notifications';

interface XmlUploaderProps {
    onFileUploaded: (file: UploadedXmlFile) => void;
    disabled?: boolean;
}

export default function XmlUploader({ onFileUploaded, disabled = false }: XmlUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = async (file: File) => {
        if (!XmlConverterService.isValidXmlFile(file.name)) {
            NotificationService.error('Por favor selecciona un archivo XML válido');
            return;
        }

        setIsProcessing(true);

        try {
            const content = await file.text();
            
            // Validate XML by trying to parse it
            try {
                XmlConverterService.parseXml(content);
            } catch (error) {
                NotificationService.error('El archivo XML no es válido o está mal formado');
                setIsProcessing(false);
                return;
            }

            const uploadedFile: UploadedXmlFile = {
                name: file.name,
                size: file.size,
                content,
                uploadDate: new Date()
            };

            onFileUploaded(uploadedFile);
            NotificationService.success('Archivo XML cargado exitosamente');
        } catch (error) {
            console.error('Error reading file:', error);
            NotificationService.error('Error al leer el archivo XML');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept=".xml"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={disabled || isProcessing}
            />
            
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragging 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                    }
                    ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className={`
                        p-4 rounded-full transition-colors
                        ${isDragging ? 'bg-purple-100' : 'bg-gray-100'}
                    `}>
                        <svg 
                            className={`w-12 h-12 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    
                    <div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            {isProcessing ? 'Procesando archivo...' : 'Arrastra tu archivo XML aquí'}
                        </p>
                        <p className="text-sm text-gray-500">
                            o haz clic para seleccionar un archivo
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Solo archivos .xml</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
