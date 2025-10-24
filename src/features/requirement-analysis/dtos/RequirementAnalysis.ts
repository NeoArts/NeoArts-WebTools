export interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    content: string | ArrayBuffer;
    uploadedAt: Date;
}

export interface AnalysisRequest {
    files: UploadedFile[];
    timestamp: Date;
    sessionId: string;
}

// New DTOs based on the Document Analysis API Guide
export interface DocumentAnalysisRequest {
    file: File;
}

export interface DocumentAnalysisResponse {
    user_stories: string[];
    development_type: 'new_feature' | 'bug_fix' | 'enhancement' | 'refactoring' | 'maintenance';
    summary: string;
    github_copilot_prompt: string;
    confidence_score: number;
    error: string | null;
}

export interface SupportedFormatsResponse {
    supported_formats: string[];
    description: string;
    examples: {
        [key: string]: string;
    };
}

export interface AnalysisResult {
    id: string;
    request: AnalysisRequest;
    prompt: string;
    generatedAt: Date;
    processingTime: number;
    status: 'pending' | 'completed' | 'error';
    error?: string;
    // New fields from API
    user_stories?: string[];
    development_type?: string;
    summary?: string;
    confidence_score?: number;
}

export interface ApiResponse {
    success: boolean;
    data?: {
        prompt: string;
        analysis_id: string;
        processing_time: number;
    };
    error?: string;
}
