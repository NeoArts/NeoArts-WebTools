import type { AnalysisResult } from '../dtos/RequirementAnalysis';

export class RequirementAnalysisStorage {
    private static readonly STORAGE_KEY = 'requirement_analysis_history';

    /**
     * Saves an analysis result to localStorage
     */
    static saveAnalysis(analysis: AnalysisResult): void {
        try {
            const existing = this.getAnalysisHistory();
            const updated = [analysis, ...existing].slice(0, 10); // Keep last 10
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Error saving analysis:', error);
        }
    }

    /**
     * Gets analysis history from localStorage
     */
    static getAnalysisHistory(): AnalysisResult[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) return [];
            
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) return [];
            
            // Convert date strings back to Date objects
            return parsed.map(analysis => ({
                ...analysis,
                generatedAt: new Date(analysis.generatedAt),
                request: {
                    ...analysis.request,
                    timestamp: new Date(analysis.request.timestamp),
                    files: analysis.request.files.map((file: any) => ({
                        ...file,
                        uploadedAt: new Date(file.uploadedAt)
                    }))
                }
            }));
        } catch (error) {
            console.error('Error loading analysis history:', error);
            return [];
        }
    }

    /**
     * Clears all analysis history
     */
    static clearHistory(): void {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }

    /**
     * Deletes a specific analysis from history
     */
    static deleteAnalysis(analysisId: string): void {
        try {
            const existing = this.getAnalysisHistory();
            const filtered = existing.filter(analysis => analysis.id !== analysisId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error deleting analysis:', error);
        }
    }
}
