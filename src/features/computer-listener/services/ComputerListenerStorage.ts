import type { ListenerSettings, SessionState } from '../dtos/ComputerListener';

export class ComputerListenerStorage {
    private static readonly SETTINGS_KEY = 'computer_listener_settings';
    private static readonly SESSION_KEY = 'computer_listener_session';

    /**
     * Get user settings
     */
    static getSettings(): ListenerSettings {
        try {
            const stored = localStorage.getItem(this.SETTINGS_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        
        // Default settings
        return {
            userName: 'Tomás',
            chunkDuration: 20,
            sampleRate: 16000,
            autoRefresh: true,
            refreshInterval: 30
        };
    }

    /**
     * Save user settings
     */
    static saveSettings(settings: ListenerSettings): void {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    /**
     * Get session state
     */
    static getSessionState(): SessionState {
        try {
            const stored = localStorage.getItem(this.SESSION_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    ...parsed,
                    lastUpdate: parsed.lastUpdate ? new Date(parsed.lastUpdate) : null,
                    sessionStartTime: parsed.sessionStartTime ? new Date(parsed.sessionStartTime) : null
                };
            }
        } catch (error) {
            console.error('Error loading session state:', error);
        }

        // Default session state
        return {
            isListening: false,
            isConnected: false,
            lastUpdate: null,
            sessionStartTime: null,
            userName: 'Tomás',
            error: null
        };
    }

    /**
     * Save session state
     */
    static saveSessionState(state: SessionState): void {
        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Error saving session state:', error);
        }
    }

    /**
     * Clear session state
     */
    static clearSessionState(): void {
        try {
            localStorage.removeItem(this.SESSION_KEY);
        } catch (error) {
            console.error('Error clearing session state:', error);
        }
    }
}
