import React, { useState, useRef, useCallback } from 'react';
import Button from '../../../shared/ui/components/Button';
import { Mp3TranscriptionService } from '../services/Mp3TranscriptionService';
import type { UploadedAudioFile } from '../dtos/Mp3Transcription';
import { NotificationService } from '../../../shared/services/notifications';

interface AudioUploaderProps {
    onFileUploaded: (file: UploadedAudioFile) => void;
    onTranscriptionStart?: (file: File) => Promise<void>;
    disabled?: boolean;
}

export default function AudioUploader({ onFileUploaded, onTranscriptionStart, disabled = false }: AudioUploaderProps) {
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateId = (): string => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const processFile = useCallback(async (file: File) => {
        if (disabled || uploading) return;

        setUploading(true);

        try {
            console.log('Archivo subido:', file);
            // Validate file
            const validation = await Mp3TranscriptionService.validateAudioFile(file);
            if (!validation.valid) {
                console.error('Error en la validación del archivo:', file);
                NotificationService.error(`Error en ${file.name}: ${validation.error}`);
                return;
            }
            console.log('Archivo validado:', file);
            // Create uploaded file object
            const uploadedFile: UploadedAudioFile = {
                id: generateId(),
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date()
            };
            console.log('Archivo subido:', uploadedFile);
            onFileUploaded(uploadedFile);
            
            // Start transcription if callback is provided
            if (onTranscriptionStart) {
                await onTranscriptionStart(file);
            }
            
            NotificationService.success(`Archivo ${file.name} cargado exitosamente`);
        } catch (error) {
            NotificationService.error(`Error procesando ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            console.error('File processing error:', error);
        } finally {
            setUploading(false);
        }
    }, [disabled, uploading, onFileUploaded, onTranscriptionStart]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 1) {
            NotificationService.error('Solo se puede cargar un archivo a la vez');
            return;
        }

        if (files.length === 1) {
            processFile(files[0]);
        }
    }, [disabled, processFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            processFile(files[0]);
        }
        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    }, [processFile]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'mp3':
            case 'mp4':
            case 'mpeg':
            case 'mpga':
            case 'm4a':
            case 'wav':
            case 'webm':
                return '🎵';
            default:
                return '📁';
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-all
                    ${dragOver && !disabled 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={disabled}
                    accept=".mp3,.mp4,.mpeg,.mpga,.m4a,.wav,.webm"
                />

                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-gray-100 rounded-full">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-lg font-medium text-gray-900">
                            {uploading ? 'Cargando archivo...' : 'Arrastra un archivo de audio aquí o haz clic para seleccionar'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Soporta: MP3, MP4, MPEG, MPGA, M4A, WAV, WEBM
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Máximo 25MB por archivo
                        </p>
                    </div>

                    {uploading && (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Supported Formats Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-1">Formatos soportados</p>
                        <p className="text-blue-800">
                            El servicio utiliza OpenAI Whisper para transcribir archivos de audio. 
                            Asegúrate de que tu archivo sea menor a 25MB y esté en uno de los formatos compatibles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
