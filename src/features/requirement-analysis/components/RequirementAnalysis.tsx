import React, { useState, useEffect } from 'react';
import Button from '../../../shared/ui/components/Button';
import FileUploader from './FileUploader';
import MarkdownDisplay from './MarkdownDisplay';
import { RequirementAnalysisService } from '../services/RequirementAnalysisService';
import { RequirementAnalysisStorage } from '../services/RequirementAnalysisStorage';
import type { UploadedFile, AnalysisResult } from '../dtos/RequirementAnalysis';
import { NotificationService } from '../../../shared/services/notifications';

export default function RequirementAnalysis() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
    const [apiConnected, setApiConnected] = useState<boolean | null>(null);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    // Load history and check API connection on component mount
    useEffect(() => {
        try {
            const history = RequirementAnalysisStorage.getAnalysisHistory();
            setAnalysisHistory(history);
        } catch (error) {
            console.error('Error loading history, clearing localStorage:', error);
            // Clear corrupted data
            RequirementAnalysisStorage.clearHistory();
            setAnalysisHistory([]);
        }

        // Check API connection
        checkApiConnection();
    }, []);

    const checkApiConnection = async () => {
        setIsCheckingConnection(true);
        try {
            const { connected } = await RequirementAnalysisService.testConnection();
            setApiConnected(connected);
            if (!connected) {
                NotificationService.warning('Document Analysis API is not available. Features may be limited.');
            }
        } catch (error) {
            setApiConnected(false);
            console.error('API connection check failed:', error);
        } finally {
            setIsCheckingConnection(false);
        }
    };

    const handleFilesUploaded = (files: UploadedFile[]) => {
        setUploadedFiles(files);
        // Clear previous analysis when files change
        if (analysisResult) {
            setAnalysisResult(null);
        }
    };

    const handleAnalyzeFiles = async () => {
        if (uploadedFiles.length === 0) {
            NotificationService.error('Debes cargar al menos un archivo para analizar');
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await RequirementAnalysisService.analyzeFiles(uploadedFiles);
            
            if (result.status === 'completed') {
                setAnalysisResult(result);
                RequirementAnalysisStorage.saveAnalysis(result);
                const updatedHistory = RequirementAnalysisStorage.getAnalysisHistory();
                setAnalysisHistory(updatedHistory);
                NotificationService.success('Análisis completado exitosamente');
            } else {
                NotificationService.error(`Error en el análisis: ${result.error}`);
            }
        } catch (error) {
            NotificationService.error('Error inesperado durante el análisis');
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleClearAnalysis = () => {
        setAnalysisResult(null);
        setUploadedFiles([]);
    };

    const handleExportPrompt = () => {
        if (!analysisResult?.prompt) return;

        const blob = new Blob([analysisResult.prompt], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `github-copilot-prompt-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        NotificationService.success('Prompt exportado exitosamente');
    };

    const copyToClipboard = async () => {
        if (!analysisResult?.prompt) return;

        try {
            await navigator.clipboard.writeText(analysisResult.prompt);
            NotificationService.success('Prompt copiado al portapapeles');
        } catch (error) {
            NotificationService.error('Error al copiar al portapapeles');
        }
    };

    const formatProcessingTime = (ms: number): string => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    const formatDate = (date: Date | string): string => {
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            if (isNaN(dateObj.getTime())) {
                return 'Fecha inválida';
            }
            return dateObj.toLocaleDateString('es-ES');
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const formatTime = (date: Date | string): string => {
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            if (isNaN(dateObj.getTime())) {
                return 'Hora inválida';
            }
            return dateObj.toLocaleTimeString('es-ES');
        } catch (error) {
            return 'Hora inválida';
        }
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
                         apiConnected ? 'Document Analysis API Connected' : 'API Unavailable - Using fallback mode'}
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
                     apiConnected ? 'Real-time document analysis with AI-powered user story extraction available.' : 
                     'API not available. Analysis will use fallback prompt generation.'}
                </p>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Subir documentos para análisis
                    </h2>
                    <p className="text-gray-600">
                        Carga documentos con requerimientos en formato PDF, Excel (XLSX/XLS), Word (DOCX), Markdown (MD) o texto plano (TXT). 
                        El sistema extraerá historias de usuario y generará un prompt detallado para GitHub Copilot.
                    </p>
                </div>

                <FileUploader 
                    onFilesUploaded={handleFilesUploaded}
                    disabled={isAnalyzing}
                />

                {uploadedFiles.length > 0 && (
                    <div className="mt-6 flex gap-3">
                        <Button
                            text={isAnalyzing ? 'Analizando...' : 'Analizar archivos'}
                            onClick={handleAnalyzeFiles}
                            loading={isAnalyzing}
                            disabled={isAnalyzing || uploadedFiles.length === 0}
                            icon={!isAnalyzing && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            )}
                        />
                        
                        {analysisResult && (
                            <Button
                                text="Nuevo análisis"
                                onClick={handleClearAnalysis}
                                variant="secondary"
                                disabled={isAnalyzing}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Analysis Results Section */}
            {analysisResult && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Análisis de Requerimientos
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Generado: {formatDate(analysisResult.generatedAt)} - {formatTime(analysisResult.generatedAt)}</span>
                                <span>Tiempo de procesamiento: {formatProcessingTime(analysisResult.processingTime)}</span>
                                <span>Archivos analizados: {analysisResult.request.files.length}</span>
                                {analysisResult.confidence_score && (
                                    <span>Confianza: {(analysisResult.confidence_score * 100).toFixed(1)}%</span>
                                )}
                            </div>
                            {analysisResult.development_type && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {analysisResult.development_type.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            )}
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
                                text="Exportar MD"
                                onClick={handleExportPrompt}
                                variant="secondary"
                                size="sm"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {analysisResult.status === 'completed' ? (
                        <div className="space-y-6">
                            {/* User Stories Section */}
                            {analysisResult.user_stories && analysisResult.user_stories.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-3">Historias de Usuario Extraídas</h3>
                                    <ul className="space-y-2">
                                        {analysisResult.user_stories.map((story, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                                                <span className="font-medium text-blue-600 mt-0.5">{index + 1}.</span>
                                                <span>{story}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Summary Section */}
                            {analysisResult.summary && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-medium text-green-900 mb-2">Resumen del Análisis</h3>
                                    <p className="text-sm text-green-800">{analysisResult.summary}</p>
                                </div>
                            )}

                            {/* GitHub Copilot Prompt */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="font-medium text-gray-900 mb-3">Prompt para GitHub Copilot</h3>
                                <MarkdownDisplay content={analysisResult.prompt} />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-red-800">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Error en el análisis</p>
                                    <p className="text-sm">{analysisResult.error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Historial de análisis
                    </h2>

                    <div className="space-y-3">
                        {analysisHistory.map((analysis) => (
                            <div 
                                key={analysis.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => setAnalysisResult(analysis)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${
                                            analysis.status === 'completed' ? 'bg-green-500' :
                                            analysis.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`} />
                                        <span className="font-medium text-gray-900">
                                            {analysis.request.files.length} archivo(s) analizados
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(analysis.generatedAt)} - {formatTime(analysis.generatedAt)}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        Archivos: {analysis.request.files.map(f => f.name).join(', ')}
                                    </div>
                                </div>
                                
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
