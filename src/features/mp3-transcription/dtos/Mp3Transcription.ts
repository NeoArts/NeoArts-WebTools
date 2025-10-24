export interface TranscriptionRequest {
    file: File;
}

export interface TranscriptionResponse {
    transcription: string;
    duration_seconds: number | null;
    file_size_mb: number;
    processing_time_seconds: number;
    error: string | null;
}

export interface SupportedFormatsResponse {
    supported_formats: string[];
    max_file_size_mb: number;
    description: string;
}

export interface HealthCheckResponse {
    status: string;
    service: string;
    description: string;
}

export interface UploadedAudioFile {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
    transcription?: TranscriptionResponse;
}

export interface TranscriptionHistory {
    id: string;
    fileName: string;
    fileSize: number;
    transcription: string;
    processingTime: number;
    transcribedAt: Date;
    error?: string;
}
