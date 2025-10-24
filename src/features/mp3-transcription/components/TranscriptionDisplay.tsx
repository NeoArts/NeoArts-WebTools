import React from 'react';
import Button from '../../../shared/ui/components/Button';
import type { TranscriptionResponse } from '../dtos/Mp3Transcription';
import { NotificationService } from '../../../shared/services/notifications';

interface TranscriptionDisplayProps {
    transcription: TranscriptionResponse;
    fileName: string;
    onClear: () => void;
}

export default function TranscriptionDisplay({ transcription, fileName, onClear }: TranscriptionDisplayProps) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(transcription.transcription);
            NotificationService.success('Transcripción copiada al portapapeles');
        } catch (error) {
            NotificationService.error('Error al copiar al portapapeles');
        }
    };

    const downloadTranscription = () => {
        const blob = new Blob([transcription.transcription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.replace(/\.[^/.]+$/, '')}_transcription.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        NotificationService.success('Transcripción descargada exitosamente');
    };

    const formatProcessingTime = (seconds: number): string => {
        if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
        return `${seconds.toFixed(2)}s`;
    };

    const formatFileSize = (mb: number): string => {
        if (mb < 1) return `${(mb * 1024).toFixed(2)}KB`;
        return `${mb.toFixed(2)}MB`;
    };

    if (transcription.error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Error en la transcripción</h3>
                    <Button
                        text="Reintentar"
                        onClick={onClear}
                        variant="secondary"
                        size="sm"
                    />
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <p className="font-medium">Error al procesar el archivo</p>
                            <p className="text-sm">{transcription.error}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                    <p>Archivo: {fileName}</p>
                    <p>Tamaño: {formatFileSize(transcription.file_size_mb)}</p>
                    <p>Tiempo de procesamiento: {formatProcessingTime(transcription.processing_time_seconds)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Transcripción completada</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span>Archivo: {fileName}</span>
                        <span>Tamaño: {formatFileSize(transcription.file_size_mb)}</span>
                        <span>Procesado en: {formatProcessingTime(transcription.processing_time_seconds)}</span>
                        {transcription.duration_seconds && (
                            <span>Duración: {transcription.duration_seconds.toFixed(1)}s</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        text="Copiar"
                        onClick={copyToClipboard}
                        variant="secondary"
                        size="sm"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                    <Button
                        text="Descargar"
                        onClick={downloadTranscription}
                        variant="secondary"
                        size="sm"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                    />
                    <Button
                        text="Nueva transcripción"
                        onClick={onClear}
                        variant="secondary"
                        size="sm"
                    />
                </div>
            </div>

            {/* Transcription Content */}
            <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Texto transcrito</h4>
                    <div className="max-h-96 overflow-y-auto">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {transcription.transcription}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-blue-900">
                            {transcription.transcription.length}
                        </div>
                        <div className="text-xs text-blue-600">Caracteres</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-green-900">
                            {transcription.transcription.split(/\s+/).filter(word => word.length > 0).length}
                        </div>
                        <div className="text-xs text-green-600">Palabras</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-purple-900">
                            {formatFileSize(transcription.file_size_mb)}
                        </div>
                        <div className="text-xs text-purple-600">Tamaño archivo</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-orange-900">
                            {formatProcessingTime(transcription.processing_time_seconds)}
                        </div>
                        <div className="text-xs text-orange-600">Tiempo proceso</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
