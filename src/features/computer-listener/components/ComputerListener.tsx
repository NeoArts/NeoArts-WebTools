import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../shared/ui/components/Button';
import MarkdownDisplay from '../../requirement-analysis/components/MarkdownDisplay';
import TextAnalyzer from './TextAnalyzer';
import { MeetingAgentService } from '../services/MeetingAgentService';
import { ComputerListenerStorage } from '../services/ComputerListenerStorage';
import type { SessionState, ListenerSettings, TranscriptResponse } from '../dtos/ComputerListener';
import { NotificationService } from '../../../shared/services/notifications';

export default function ComputerListener() {
    const [sessionState, setSessionState] = useState<SessionState>(ComputerListenerStorage.getSessionState());
    const [settings, setSettings] = useState<ListenerSettings>(ComputerListenerStorage.getSettings());
    const [transcript, setTranscript] = useState<string>('');
    const [alerts, setAlerts] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [showSettings, setShowSettings] = useState(false);
    
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const statusCheckRef = useRef<NodeJS.Timeout | null>(null);

    // Check API connection on mount
    useEffect(() => {
        checkConnection();
        
        // Start status monitoring
        statusCheckRef.current = setInterval(checkStatus, 5000); // Check every 5 seconds
        
        return () => {
            if (statusCheckRef.current) {
                clearInterval(statusCheckRef.current);
            }
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);

    // Auto-refresh transcript when listening
    useEffect(() => {
        if (sessionState.isListening && settings.autoRefresh) {
            refreshIntervalRef.current = setInterval(
                refreshTranscript, 
                settings.refreshInterval * 1000
            );
        } else {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [sessionState.isListening, settings.autoRefresh, settings.refreshInterval]);

    const checkConnection = async () => {
        setConnectionStatus('checking');
        const result = await MeetingAgentService.testConnection();
        setConnectionStatus(result.connected ? 'connected' : 'disconnected');
        
        if (!result.connected) {
            setSessionState(prev => ({ ...prev, isConnected: false, error: result.message }));
        } else {
            setSessionState(prev => ({ ...prev, isConnected: true, error: null }));
        }
    };

    const checkStatus = async () => {
        if (connectionStatus !== 'connected') return;
        
        try {
            const status = await MeetingAgentService.getStatus();
            const isActive = status.status === 'active';
            
            setSessionState(prev => {
                const newState = {
                    ...prev,
                    isListening: isActive,
                    lastUpdate: new Date(),
                    error: status.status === 'error' ? status.error : null
                };
                ComputerListenerStorage.saveSessionState(newState);
                return newState;
            });
        } catch (error) {
            console.error('Status check failed:', error);
        }
    };

    const startListening = async () => {
        setIsLoading(true);
        try {
            const result = await MeetingAgentService.startSession({
                user_name: settings.userName,
                chunk_duration: settings.chunkDuration,
                sample_rate: settings.sampleRate
            });

            if (result.status === 'success') {
                const newState = {
                    ...sessionState,
                    isListening: true,
                    sessionStartTime: new Date(),
                    error: null
                };
                setSessionState(newState);
                ComputerListenerStorage.saveSessionState(newState);
                NotificationService.success('Sesión de escucha iniciada exitosamente');
            } else {
                NotificationService.error(`Error: ${result.message}`);
                setSessionState(prev => ({ ...prev, error: result.error }));
            }
        } catch (error) {
            NotificationService.error('Error al iniciar la sesión');
            console.error('Start session error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stopListening = async () => {
        setIsLoading(true);
        try {
            const result = await MeetingAgentService.stopSession();

            if (result.status === 'success') {
                const newState = {
                    ...sessionState,
                    isListening: false,
                    sessionStartTime: null,
                    error: null
                };
                setSessionState(newState);
                ComputerListenerStorage.saveSessionState(newState);
                NotificationService.success('Sesión de escucha detenida');
            } else {
                NotificationService.error(`Error: ${result.message}`);
                setSessionState(prev => ({ ...prev, error: result.error }));
            }
        } catch (error) {
            NotificationService.error('Error al detener la sesión');
            console.error('Stop session error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshTranscript = async () => {
        try {
            const result: TranscriptResponse = await MeetingAgentService.getTranscript();
            
            if (result.transcript !== undefined) {
                setTranscript(result.transcript);
            }
            if (result.alerts !== undefined) {
                setAlerts(result.alerts);
            }
            
            setSessionState(prev => ({
                ...prev,
                lastUpdate: new Date(),
                error: result.status === 'error' ? result.error : null
            }));
        } catch (error) {
            console.error('Refresh transcript error:', error);
            setSessionState(prev => ({ ...prev, error: 'Error al obtener transcripción' }));
        }
    };

    const saveSettings = () => {
        ComputerListenerStorage.saveSettings(settings);
        NotificationService.success('Configuración guardada');
        setShowSettings(false);
    };

    const formatDuration = (startTime: Date): string => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'bg-green-500';
            case 'disconnected': return 'bg-red-500';
            case 'checking': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'Conectado';
            case 'disconnected': return 'Desconectado';
            case 'checking': return 'Verificando...';
            default: return 'Desconocido';
        }
    };

    return (
        <div className="space-y-6">
            {/* Control Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Control de Escucha
                        </h2>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
                                <span className="text-gray-600">{getConnectionStatusText()}</span>
                            </div>
                            {sessionState.lastUpdate && (
                                <span className="text-gray-500">
                                    Última actualización: {sessionState.lastUpdate.toLocaleTimeString('es-ES')}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            text="Configuración"
                            onClick={() => setShowSettings(!showSettings)}
                            variant="secondary"
                            size="sm"
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        />
                        
                        <Button
                            text="Refrescar"
                            onClick={refreshTranscript}
                            variant="secondary"
                            size="sm"
                            disabled={connectionStatus !== 'connected'}
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                {/* Connection Error */}
                {sessionState.error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-800">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <p className="font-medium">Error de conexión</p>
                                <p className="text-sm">{sessionState.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Session Status */}
                {sessionState.isListening && sessionState.sessionStartTime && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-green-800">Sesión activa</p>
                                <p className="text-sm text-green-600">
                                    Usuario: {sessionState.userName} • Duración: {formatDuration(sessionState.sessionStartTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-3">
                    {!sessionState.isListening ? (
                        <Button
                            text={isLoading ? 'Iniciando...' : 'Iniciar Escucha'}
                            onClick={startListening}
                            loading={isLoading}
                            disabled={connectionStatus !== 'connected' || isLoading}
                            icon={!isLoading && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        />
                    ) : (
                        <Button
                            text={isLoading ? 'Deteniendo...' : 'Detener Escucha'}
                            onClick={stopListening}
                            loading={isLoading}
                            disabled={isLoading}
                            variant="danger"
                            icon={!isLoading && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                            )}
                        />
                    )}
                    
                    <Button
                        text="Verificar Conexión"
                        onClick={checkConnection}
                        variant="secondary"
                        disabled={connectionStatus === 'checking'}
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                value={settings.userName}
                                onChange={(e) => setSettings(prev => ({ ...prev, userName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Ej: Tomás"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duración del chunk (segundos)
                            </label>
                            <input
                                type="number"
                                min="10"
                                max="60"
                                value={settings.chunkDuration}
                                onChange={(e) => setSettings(prev => ({ ...prev, chunkDuration: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sample Rate (Hz)
                            </label>
                            <select
                                value={settings.sampleRate}
                                onChange={(e) => setSettings(prev => ({ ...prev, sampleRate: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value={16000}>16000 Hz</option>
                                <option value={44100}>44100 Hz</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Intervalo de actualización (segundos)
                            </label>
                            <input
                                type="number"
                                min="10"
                                max="300"
                                value={settings.refreshInterval}
                                onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                disabled={!settings.autoRefresh}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={settings.autoRefresh}
                                onChange={(e) => setSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Actualización automática de transcripción</span>
                        </label>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button
                            text="Guardar"
                            onClick={saveSettings}
                        />
                        <Button
                            text="Cancelar"
                            onClick={() => setShowSettings(false)}
                            variant="secondary"
                        />
                    </div>
                </div>
            )}

            {/* Text Analyzer */}
            <TextAnalyzer transcript={transcript} />

            {/* Transcript and Alerts */}
            {(transcript || alerts) && (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    {/* Transcript */}
                    {transcript && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcripción</h3>
                            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                {transcript ? (
                                    <MarkdownDisplay content={transcript} />
                                ) : (
                                    <p className="text-gray-500 text-sm">No hay transcripción disponible</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Alerts */}
                    {alerts && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas</h3>
                            <div className="bg-yellow-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                {alerts ? (
                                    <MarkdownDisplay content={alerts} />
                                ) : (
                                    <p className="text-gray-500 text-sm">No hay alertas disponibles</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
