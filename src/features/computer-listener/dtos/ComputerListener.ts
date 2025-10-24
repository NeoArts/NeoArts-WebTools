export interface SessionConfig {
    user_name: string;
    chunk_duration?: number;
    sample_rate?: number;
}

export interface ApiResponse<T = any> {
    status: 'success' | 'error' | 'active' | 'inactive';
    message: string;
    error: string | null;
    data?: T;
}

export interface StartSessionRequest {
    user_name: string;
    chunk_duration?: number;
    sample_rate?: number;
}

export interface StartSessionResponse extends ApiResponse {
    status: 'success' | 'error';
}

export interface StopSessionResponse extends ApiResponse {
    status: 'success' | 'error';
}

export interface StatusResponse extends ApiResponse {
    status: 'active' | 'inactive' | 'error';
}

export interface TranscriptResponse extends ApiResponse {
    transcript: string;
    alerts: string;
}

export interface AnalyzeTextRequest {
    text: string;
    user_name: string;
}

export interface AnalyzeTextResponse extends ApiResponse {
    trigger: boolean;
    summary: string;
    response: string;
}

export interface QuestionRequest {
    question: string;
    include_alerts?: boolean;
}

export interface QuestionResponse extends ApiResponse {
    answer: string;
    context_used: string;
}

export interface SessionState {
    isListening: boolean;
    isConnected: boolean;
    lastUpdate: Date | null;
    sessionStartTime: Date | null;
    userName: string;
    error: string | null;
}

export interface ListenerSettings {
    userName: string;
    chunkDuration: number;
    sampleRate: number;
    autoRefresh: boolean;
    refreshInterval: number;
}
