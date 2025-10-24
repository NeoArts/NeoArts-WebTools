import React, { useState, useEffect } from 'react';
import Button from '../../../shared/ui/components/Button';
import AudioUploader from './AudioUploader';
import TranscriptionDisplay from './TranscriptionDisplay';
import { Mp3TranscriptionService } from '../services/Mp3TranscriptionService';
import type { 
    UploadedAudioFile, 
    TranscriptionResponse, 
    TranscriptionHistory,
    SupportedFormatsResponse 
} from '../dtos/Mp3Transcription';
import { NotificationService } from '../../../shared/services/notifications';

export default function Mp3Transcription() {
    const [uploadedFile, setUploadedFile] = useState<UploadedAudioFile | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResponse | null>(null);
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionHistory[]>([]);
    const [apiConnected, setApiConnected] = useState<boolean | null>(null);
    const [supportedFormats, setSupportedFormats] = useState<SupportedFormatsResponse | null>(null);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    // Load history and check API connection on component mount
    useEffect(() => {
        loadTranscriptionHistory();
        checkApiConnection();
        loadSupportedFormats();
    }, []);

    const loadTranscriptionHistory = () => {
        try {
            const history = Mp3TranscriptionService.getTranscriptionHistory();
            setTranscriptionHistory(history);
        } catch (error) {
            console.error('Error loading transcription history:', error);
            Mp3TranscriptionService.clearTranscriptionHistory();
            setTranscriptionHistory([]);
        }
    };

    const checkApiConnection = async () => {
        setIsCheckingConnection(true);
        try {
            const { connected } = await Mp3TranscriptionService.testConnection();
            setApiConnected(connected);
            if (!connected) {
                NotificationService.warning('MP3 Transcription API is not available. Service may be limited.');
            }
        } catch (error) {
            setApiConnected(false);
            console.error('API connection check failed:', error);
        } finally {
            setIsCheckingConnection(false);
        }
    };

    const loadSupportedFormats = async () => {
        try {
            const formats = await Mp3TranscriptionService.getSupportedFormats();
            setSupportedFormats(formats);
        } catch (error) {
            console.error('Error loading supported formats:', error);
        }
    };

    const handleFileUploaded = (file: UploadedAudioFile) => {
        setUploadedFile(file);
        // Clear previous transcription when a new file is uploaded
        if (transcriptionResult) {
            setTranscriptionResult(null);
        }
    };

    const handleTranscriptionStart = async (file: File) => {
        if (!apiConnected) {
            NotificationService.error('La API de transcripción no está disponible');
            return;
        }

        setIsTranscribing(true);
        try {
            const result = await Mp3TranscriptionService.transcribeAudio(file);
            setTranscriptionResult(result);

            if (result.error) {
                NotificationService.error(`Error en la transcripción: ${result.error}`);
            } else {
                NotificationService.success('Transcripción completada exitosamente');
                
                // Save to history
                Mp3TranscriptionService.saveTranscriptionHistory(file.name, file.size, result);
                loadTranscriptionHistory();
            }
        } catch (error) {
            NotificationService.error('Error inesperado durante la transcripción');
            console.error('Transcription error:', error);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleClearTranscription = () => {
        setTranscriptionResult(null);
        setUploadedFile(null);
    };

    const formatDate = (date: Date): string => {
        try {
            return date.toLocaleDateString('es-ES');
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const formatTime = (date: Date): string => {
        try {
            return date.toLocaleTimeString('es-ES');
        } catch (error) {
            return 'Hora inválida';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* API Connection Status */}
            <div className={`rounded-lg p-4 border ${
                apiConnected === null ? 'bg-gray-50 border-gray-200' :
                apiConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
                <div className="flex items-center gap-3">
                    {isCheckingConnection ? (
                        <svg className="animate-spin w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                        </svg>
                    ) : (
                        <div className={`w-3 h-3 rounded-full ${
                            apiConnected === null ? 'bg-gray-400' :
                            apiConnected ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                    )}
                    <span className={`font-medium ${
                        apiConnected === null ? 'text-gray-700' :
                        apiConnected ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                        {isCheckingConnection ? 'Checking connection...' :
                         apiConnected === null ? 'Checking API status...' :
                         apiConnected ? 'MP3 Transcription API Connected' : 'API Unavailable'}
                    </span>
                    {!isCheckingConnection && (
                        <Button
                            text="Retry"
                            onClick={checkApiConnection}
                            variant="secondary"
                            size="sm"
                        />
                    )}
                </div>
                <p className={`text-sm mt-1 ${
                    apiConnected === null ? 'text-gray-600' :
                    apiConnected ? 'text-green-700' : 'text-yellow-700'
                }`}>
                    {apiConnected === null ? 'Verifying connection to localhost:8000...' :
                     apiConnected ? 'OpenAI Whisper AI transcription service is available.' : 
                     'Transcription service is not available. Please check if the API is running.'}
                </p>
                
                {supportedFormats && (
                    <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Supported formats:</span> {supportedFormats.supported_formats.join(', ')} | 
                        <span className="font-medium"> Max size:</span> {supportedFormats.max_file_size_mb}MB
                    </div>
                )}
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Subir archivo de audio
                    </h2>
                    <p className="text-gray-600">
                        Carga un archivo de audio para obtener su transcripción usando OpenAI Whisper. 
                        Soporta MP3, MP4, WAV, M4A y otros formatos de audio comunes.
                    </p>
                </div>

                <AudioUploader 
                    onFileUploaded={handleFileUploaded}
                    onTranscriptionStart={handleTranscriptionStart}
                    disabled={isTranscribing || !apiConnected}
                />

                {isTranscribing && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="font-medium text-blue-900">Transcribiendo audio...</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                            Esto puede tomar unos momentos dependiendo del tamaño del archivo.
                        </p>
                    </div>
                )}
            </div>

            {/* Transcription Results */}
            {transcriptionResult && uploadedFile && (
                <TranscriptionDisplay
                    transcription={transcriptionResult}
                    fileName={uploadedFile.name}
                    onClear={handleClearTranscription}
                />
            )}

            {/* Transcription History */}
            {transcriptionHistory.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Historial de transcripciones
                        </h2>
                        <Button
                            text="Limpiar historial"
                            onClick={() => {
                                Mp3TranscriptionService.clearTranscriptionHistory();
                                loadTranscriptionHistory();
                                NotificationService.success('Historial limpiado');
                            }}
                            variant="tertiary"
                            size="sm"
                        />
                    </div>

                    <div className="space-y-3">
                        {transcriptionHistory.map((item) => (
                            <div 
                                key={item.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${
                                            item.error ? 'bg-red-500' : 'bg-green-500'
                                        }`} />
                                        <span className="font-medium text-gray-900">
                                            {item.fileName}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(item.transcribedAt)} - {formatTime(item.transcribedAt)}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        Tamaño: {formatFileSize(item.fileSize)} • 
                                        Tiempo: {item.processingTime.toFixed(2)}s • 
                                        Palabras: {item.transcription.split(/\s+/).filter(word => word.length > 0).length}
                                    </div>
                                    {item.error && (
                                        <div className="mt-1 text-sm text-red-600">
                                            Error: {item.error}
                                        </div>
                                    )}
                                </div>
                                
                                {!item.error && (
                                    <Button
                                        text="Ver transcripción"
                                        onClick={() => {
                                            setTranscriptionResult({
                                                transcription: item.transcription,
                                                duration_seconds: null,
                                                file_size_mb: item.fileSize / (1024 * 1024),
                                                processing_time_seconds: item.processingTime,
                                                error: null
                                            });
                                            setUploadedFile({
                                                id: item.id,
                                                name: item.fileName,
                                                type: 'audio/mpeg',
                                                size: item.fileSize,
                                                uploadedAt: item.transcribedAt
                                            });
                                        }}
                                        variant="secondary"
                                        size="sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
