import type { 
    AnalysisRequest, 
    AnalysisResult, 
    ApiResponse, 
    UploadedFile,
    DocumentAnalysisRequest,
    DocumentAnalysisResponse,
    SupportedFormatsResponse
} from '../dtos/RequirementAnalysis';

export class RequirementAnalysisService {
    private static readonly API_BASE_URL = 'http://localhost:8000';
    
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
     * Check if the Document Analysis API is available
     */
    static async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/documents/`);
            return response.ok;
        } catch (error) {
            console.error('Document Analysis API health check failed:', error);
            return false;
        }
    }

    /**
     * Get supported file formats from the API
     */
    static async getSupportedFormats(): Promise<SupportedFormatsResponse | null> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/documents/supported-formats`);
            
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
     * Analyze a single document using the Document Analysis API
     */
    static async analyzeDocument(file: File): Promise<DocumentAnalysisResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.API_BASE_URL}/documents/analyze`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Document analysis error:', error);
            return {
                user_stories: [],
                development_type: 'new_feature',
                summary: '',
                github_copilot_prompt: '',
                confidence_score: 0.0,
                error: error instanceof Error ? error.message : 'Failed to analyze document'
            };
        }
    }
    
    /**
     * Legacy method - analyzes multiple files by processing them individually
     * and combining results (backward compatibility)
     */
    static async analyzeFiles(files: UploadedFile[]): Promise<AnalysisResult> {
        const sessionId = this.generateId();
        const request: AnalysisRequest = {
            files,
            timestamp: new Date(),
            sessionId
        };

        try {
            const startTime = Date.now();
            let combinedPrompt = '';
            let allUserStories: string[] = [];
            let developmentTypes: string[] = [];
            let summaries: string[] = [];
            let totalConfidence = 0;
            let hasErrors = false;
            let errorMessages: string[] = [];

            // Process each file individually using the new API
            for (const uploadedFile of files) {
                try {
                    // Convert UploadedFile to File object
                    const fileBlob = new Blob([uploadedFile.content], { type: uploadedFile.type });
                    const file = new File([fileBlob], uploadedFile.name, { type: uploadedFile.type });

                    const analysisResponse = await this.analyzeDocument(file);

                    if (analysisResponse.error) {
                        hasErrors = true;
                        errorMessages.push(`${uploadedFile.name}: ${analysisResponse.error}`);
                        continue;
                    }

                    // Accumulate results
                    allUserStories.push(...analysisResponse.user_stories);
                    developmentTypes.push(analysisResponse.development_type);
                    summaries.push(analysisResponse.summary);
                    totalConfidence += analysisResponse.confidence_score;

                    if (analysisResponse.github_copilot_prompt) {
                        combinedPrompt += `\n\n## Analysis of ${uploadedFile.name}\n\n${analysisResponse.github_copilot_prompt}`;
                    }
                } catch (fileError) {
                    hasErrors = true;
                    errorMessages.push(`${uploadedFile.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
                }
            }

            const processingTime = Date.now() - startTime;
            const averageConfidence = files.length > 0 ? totalConfidence / files.length : 0;

            // Create combined prompt if we have individual results
            if (!combinedPrompt && allUserStories.length > 0) {
                combinedPrompt = this.generateCombinedPrompt(allUserStories, developmentTypes, summaries, files);
            }

            const result: AnalysisResult = {
                id: this.generateId(),
                request,
                prompt: combinedPrompt || this.generateFallbackPrompt(files),
                generatedAt: new Date(),
                processingTime,
                status: hasErrors && !combinedPrompt ? 'error' : 'completed',
                error: hasErrors ? errorMessages.join('; ') : undefined,
                user_stories: allUserStories,
                development_type: this.getMostCommonType(developmentTypes),
                summary: summaries.join('; '),
                confidence_score: averageConfidence
            };

            return result;
        } catch (error) {
            const result: AnalysisResult = {
                id: this.generateId(),
                request,
                prompt: '',
                generatedAt: new Date(),
                processingTime: 0,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
            
            return result;
        }
    }

    /**
     * Generate a combined prompt from multiple analysis results
     */
    private static generateCombinedPrompt(
        userStories: string[], 
        developmentTypes: string[], 
        summaries: string[], 
        files: UploadedFile[]
    ): string {
        const mostCommonType = this.getMostCommonType(developmentTypes);
        const combinedSummary = summaries.filter(s => s).join('. ');
        
        return `# ${this.formatDevelopmentType(mostCommonType)} Request

## Summary
Based on the analysis of ${files.length} document(s): ${files.map(f => f.name).join(', ')}

${combinedSummary}

## User Stories
${userStories.map((story, index) => `${index + 1}. ${story}`).join('\n')}

## Key Requirements
${userStories.map(story => `- ${story.replace(/^As .+?, I want (.+?) so that .+$/, '$1')}`).join('\n')}

## Instructions for GitHub Copilot
Please implement the above requirements following these guidelines:
- Analyze the current project structure and codebase
- Follow existing code patterns and conventions
- Ensure compatibility with the current technology stack
- Implement proper error handling and validation
- Add appropriate tests if testing framework is present
- Follow security best practices
- Maintain code quality and readability

Focus on the functional requirements described in the user stories above.`;
    }

    /**
     * Get the most common development type from an array
     */
    private static getMostCommonType(types: string[]): string {
        if (types.length === 0) return 'new_feature';
        
        const frequency = types.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
    }

    /**
     * Format development type for display
     */
    private static formatDevelopmentType(type: string): string {
        const typeMap = {
            'new_feature': 'New Feature',
            'bug_fix': 'Bug Fix',
            'enhancement': 'Enhancement',
            'refactoring': 'Refactoring',
            'maintenance': 'Maintenance'
        };
        return typeMap[type as keyof typeof typeMap] || 'New Feature';
    }

    /**
     * Generate a fallback prompt when API analysis fails
     */
    private static generateFallbackPrompt(files: UploadedFile[]): string {
        const fileTypes = files.map(f => f.name.split('.').pop()?.toLowerCase()).filter(Boolean);
        const hasCode = fileTypes.some(type => ['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs'].includes(type || ''));
        const hasDocuments = fileTypes.some(type => ['pdf', 'doc', 'docx', 'txt'].includes(type || ''));
        const hasSpreadsheets = fileTypes.some(type => ['xlsx', 'xls', 'csv'].includes(type || ''));

        return `# Document Analysis Request

## Context
Analysis of uploaded files: ${files.map(f => f.name).join(', ')}

## File Types Detected
${hasDocuments ? '- Document files (PDF, Word, Text)' : ''}
${hasSpreadsheets ? '- Spreadsheet files (Excel, CSV)' : ''}
${hasCode ? '- Code files' : ''}

## Instructions for GitHub Copilot
Please help me analyze and implement functionality based on the uploaded files. 
Consider the file types and create appropriate solutions for:
- Document processing and parsing
- Data extraction and validation
- User interface components
- API integration where needed

Please analyze the current project structure and suggest the best implementation approach.`;
    }

    /**
     * Validates file before upload based on Document Analysis API requirements
     */
    static validateFile(file: File): { valid: boolean; error?: string } {
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        // Supported formats from the API guide
        const allowedTypes = [
            'application/pdf',                                                          // PDF
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',      // XLSX
            'application/vnd.ms-excel',                                                 // XLS
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
            'text/plain',                                                               // TXT
            'text/markdown'                                                             // MD
        ];

        const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.docx', '.txt', '.md'];

        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File size exceeds 50MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
            };
        }

        if (!allowedTypes.includes(file.type) && !this.isValidFileExtension(file.name, allowedExtensions)) {
            return {
                valid: false,
                error: `File type not supported: ${file.type}. Supported formats: PDF, XLSX, XLS, DOCX, MD, TXT`
            };
        }

        return { valid: true };
    }

    private static isValidFileExtension(fileName: string, validExtensions: string[]): boolean {
        return validExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    /**
     * Test connection to the Document Analysis API
     */
    static async testConnection(): Promise<{ connected: boolean; message: string }> {
        try {
            const isHealthy = await this.healthCheck();
            if (isHealthy) {
                return { connected: true, message: 'Connected to Document Analysis API' };
            } else {
                return { connected: false, message: 'Document Analysis API is not responding' };
            }
        } catch (error) {
            return { 
                connected: false, 
                message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
            };
        }
    }
}
