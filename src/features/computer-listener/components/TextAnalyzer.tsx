import React, { useState } from 'react';
import Button from '../../../shared/ui/components/Button';
import { MeetingAgentService } from '../services/MeetingAgentService';
import { ComputerListenerStorage } from '../services/ComputerListenerStorage';
import type { QuestionResponse } from '../dtos/ComputerListener';
import { NotificationService } from '../../../shared/services/notifications';

interface TextAnalyzerProps {
    transcript: string;
}

export default function TextAnalyzer({ transcript }: TextAnalyzerProps) {
    const [question, setQuestion] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<QuestionResponse | null>(null);
    const settings = ComputerListenerStorage.getSettings();

    const analyzeTranscript = async () => {
        if (!transcript.trim()) {
            NotificationService.error('No hay transcripción disponible para analizar');
            return;
        }

        if (!question.trim()) {
            NotificationService.error('Por favor ingresa una pregunta sobre la transcripción');
            return;
        }

        setIsAnalyzing(true);
        try {
            const response = await MeetingAgentService.askQuestion({
                question: question.trim(),
                include_alerts: true
            });

            setResult(response);
            
            if (response.status === 'error') {
                NotificationService.error(`Error: ${response.message}`);
            } else {
                NotificationService.success('Pregunta respondida exitosamente');
            }
        } catch (error) {
            NotificationService.error('Error al procesar la pregunta');
            console.error('Ask question error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearAnalysis = () => {
        setQuestion('');
        setResult(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preguntas sobre la Transcripción
            </h3>
            <p className="text-gray-600 text-sm mb-4">
                Haz preguntas específicas sobre el contenido de la transcripción actual y obtén respuestas basadas en IA
            </p>

            {!transcript.trim() ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">
                        No hay transcripción disponible. Inicia una sesión de escucha para obtener contenido que analizar.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Transcript Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transcripción actual ({transcript.length} caracteres)
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                            <p className="text-sm text-gray-700 line-clamp-4">
                                {transcript.substring(0, 300)}
                                {transcript.length > 300 && '...'}
                            </p>
                        </div>
                    </div>

                    {/* Question Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tu pregunta sobre la transcripción
                        </label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ej: ¿Se mencionó alguna tarea específica para mí?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                            rows={3}
                            disabled={isAnalyzing}
                        />
                    </div>


                    <div className="flex gap-3">
                        <Button
                            text={isAnalyzing ? 'Procesando pregunta...' : 'Preguntar sobre Transcripción'}
                            onClick={analyzeTranscript}
                            loading={isAnalyzing}
                            disabled={!question.trim() || isAnalyzing}
                            icon={!isAnalyzing && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        />
                        
                        {(question || result) && (
                            <Button
                                text="Limpiar"
                                onClick={clearAnalysis}
                                variant="secondary"
                                disabled={isAnalyzing}
                            />
                        )}
                    </div>

                    {/* Analysis Result */}
                    {result && (
                        <div className="mt-6 space-y-4">
                            <h4 className="font-medium text-gray-900">Respuesta</h4>
                            
                            {result.status === 'error' ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-red-800">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">Error al procesar la pregunta</p>
                                            <p className="text-sm">{result.error}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="font-medium text-blue-800">
                                                ✅ Pregunta procesada
                                            </span>
                                        </div>

                                        {question && (
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">
                                                    Pregunta:
                                                </p>
                                                <p className="text-sm text-blue-700 italic">
                                                    "{question}"
                                                </p>
                                            </div>
                                        )}

                                        {result.answer && (
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">
                                                    Respuesta:
                                                </p>
                                                <div className="bg-white border border-blue-300 rounded p-3 mt-1">
                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                        {result.answer}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <Button
                                                            text="Copiar respuesta"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(result.answer);
                                                                NotificationService.success('Respuesta copiada al portapapeles');
                                                            }}
                                                            variant="secondary"
                                                            size="sm"
                                                            icon={
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {result.context_used && (
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">
                                                    Contexto utilizado:
                                                </p>
                                                <p className="text-xs text-blue-600">
                                                    {result.context_used}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
