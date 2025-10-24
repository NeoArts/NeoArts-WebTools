import type { 
    StartSessionRequest, 
    StartSessionResponse, 
    StopSessionResponse, 
    StatusResponse, 
    TranscriptResponse, 
    AnalyzeTextRequest, 
    AnalyzeTextResponse,
    QuestionRequest,
    QuestionResponse
} from '../dtos/ComputerListener';

export class MeetingAgentService {
    private static readonly BASE_URL = 'http://localhost:8000';
    
    /**
     * Check if the API server is running
     */
    static async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}/`);
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    /**
     * Start a recording session
     */
    static async startSession(config: StartSessionRequest): Promise<StartSessionResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/agent/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Start session error:', error);
            return {
                status: 'error',
                message: 'Failed to start session',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Stop the current recording session
     */
    static async stopSession(): Promise<StopSessionResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/agent/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Stop session error:', error);
            return {
                status: 'error',
                message: 'Failed to stop session',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Get current session status
     */
    static async getStatus(): Promise<StatusResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/agent/status`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get status error:', error);
            return {
                status: 'error',
                message: 'Failed to get status',
                error: error instanceof Error ? error.message : 'Connection failed'
            };
        }
    }

    /**
     * Get transcript and alerts
     */
    static async getTranscript(): Promise<TranscriptResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/agent/transcript`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get transcript error:', error);
            return {
                status: 'error',
                message: 'Failed to get transcript',
                error: error instanceof Error ? error.message : 'Connection failed',
                transcript: '',
                alerts: ''
            };
        }
    }

    /**
     * Analyze text for triggers without recording
     */
    static async analyzeText(request: AnalyzeTextRequest): Promise<AnalyzeTextResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/agent/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Analyze text error:', error);
            return {
                status: 'error',
                message: 'Failed to analyze text',
                error: error instanceof Error ? error.message : 'Unknown error',
                trigger: false,
                summary: '',
                response: ''
            };
        }
    }

    /**
     * Ask questions about the current meeting transcript
     */
    static async askQuestion(request: QuestionRequest): Promise<QuestionResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/agent/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ask question error:', error);
            return {
                status: 'error',
                message: 'Failed to ask question',
                error: error instanceof Error ? error.message : 'Unknown error',
                answer: '',
                context_used: ''
            };
        }
    }

    /**
     * Test connection to the API
     */
    static async testConnection(): Promise<{ connected: boolean; message: string }> {
        try {
            const isHealthy = await this.healthCheck();
            if (isHealthy) {
                return { connected: true, message: 'Connected to Meeting Agent API' };
            } else {
                return { connected: false, message: 'API server is not responding' };
            }
        } catch (error) {
            return { 
                connected: false, 
                message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
            };
        }
    }
}
