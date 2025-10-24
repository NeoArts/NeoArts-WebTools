import type { 
    TranscriptionRequest,
    TranscriptionResponse,
    SupportedFormatsResponse,
    HealthCheckResponse,
    TranscriptionHistory
} from '../dtos/Mp3Transcription';

export class Mp3TranscriptionService {
    private static readonly API_BASE_URL = 'http://localhost:8000/audio/mp3-transcription';
    
    /**
     * Generates a simple UUID-like string
     */
    private static generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Check if the MP3 Transcription API is available
     */
    static async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/health`);
            return response.ok;
        } catch (error) {
            console.error('MP3 Transcription API health check failed:', error);
            return false;
        }
    }

    /**
     * Get API health status with detailed information
     */
    static async getHealthStatus(): Promise<HealthCheckResponse | null> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/health`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get health status:', error);
            return null;
        }
    }

    /**
     * Get supported audio formats from the API
     */
    static async getSupportedFormats(): Promise<SupportedFormatsResponse | null> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/supported-formats`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to get supported formats:', error);
            return null;
        }
    }

    /**
     * Transcribe an audio file using the MP3 Transcription API
     */
    static async transcribeAudio(file: File): Promise<TranscriptionResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.API_BASE_URL}/transcribe`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                if (response.status === 400) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Bad request');
                } else if (response.status === 413) {
                    throw new Error('File too large. Maximum size: 25MB');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Audio transcription error:', error);
            return {
                transcription: '',
                duration_seconds: null,
                file_size_mb: 0,
                processing_time_seconds: 0,
                error: error instanceof Error ? error.message : 'Failed to transcribe audio'
            };
        }
    }

    /**
     * Updated maximum file size to reflect new API limit
     */
    static async validateAudioFile(file: File): Promise<{ valid: boolean; error?: string }> {
        try {
            // Get supported formats from API
            const formatInfo = await this.getSupportedFormats();

            if (!formatInfo) {
                // Fallback validation if API is not available
                return this.fallbackValidation(file);
            }

            // Check file size
            const maxSizeBytes = 1000 * 1024 * 1024; // 1000MB
            if (file.size > maxSizeBytes) {
                return {
                    valid: false,
                    error: `File too large. Maximum size: 1000MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
                };
            }

            // Check file format
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!fileExtension || !formatInfo.supported_formats.includes(fileExtension)) {
                return {
                    valid: false,
                    error: `Unsupported format. Supported formats: ${formatInfo.supported_formats.join(', ')}`
                };
            }

            return { valid: true };
        } catch (error) {
            console.error('File validation error:', error);
            return this.fallbackValidation(file);
        }
    }

    /**
     * Updated fallback validation to allow larger files
     */
    private static fallbackValidation(file: File): { valid: boolean; error?: string } {
        const maxSize = 1000 * 1024 * 1024; // 1000MB
        const supportedFormats = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'];

        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File too large. Maximum size: 1000MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
            };
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !supportedFormats.includes(fileExtension)) {
            return {
                valid: false,
                error: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}`
            };
        }

        return { valid: true };
    }

    /**
     * Save transcription to history
     */
    static saveTranscriptionHistory(fileName: string, fileSize: number, transcriptionResponse: TranscriptionResponse): TranscriptionHistory {
        const historyItem: TranscriptionHistory = {
            id: this.generateId(),
            fileName,
            fileSize,
            transcription: transcriptionResponse.transcription,
            processingTime: transcriptionResponse.processing_time_seconds,
            transcribedAt: new Date(),
            error: transcriptionResponse.error || undefined
        };

        try {
            const existingHistory = this.getTranscriptionHistory();
            const updatedHistory = [historyItem, ...existingHistory].slice(0, 50); // Keep last 50 transcriptions
            
            localStorage.setItem('mp3-transcription-history', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Failed to save transcription history:', error);
        }

        return historyItem;
    }

    /**
     * Get transcription history from localStorage
     */
    static getTranscriptionHistory(): TranscriptionHistory[] {
        try {
            const history = localStorage.getItem('mp3-transcription-history');
            if (!history) return [];

            const parsedHistory = JSON.parse(history);
            return parsedHistory.map((item: any) => ({
                ...item,
                transcribedAt: new Date(item.transcribedAt)
            }));
        } catch (error) {
            console.error('Failed to load transcription history:', error);
            return [];
        }
    }

    /**
     * Clear transcription history
     */
    static clearTranscriptionHistory(): void {
        try {
            localStorage.removeItem('mp3-transcription-history');
        } catch (error) {
            console.error('Failed to clear transcription history:', error);
        }
    }

    /**
     * Test connection to the MP3 Transcription API
     */
    static async testConnection(): Promise<{ connected: boolean; message: string }> {
        try {
            const isHealthy = await this.healthCheck();
            if (isHealthy) {
                const status = await this.getHealthStatus();
                return { 
                    connected: true, 
                    message: status ? `Connected to ${status.service}` : 'Connected to MP3 Transcription API' 
                };
            } else {
                return { connected: false, message: 'MP3 Transcription API is not responding' };
            }
        } catch (error) {
            return { 
                connected: false, 
                message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
            };
        }
    }
}
