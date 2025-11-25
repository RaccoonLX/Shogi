// API base URL - uses environment variable in production, falls back to relative paths in development
const API_URL = import.meta.env.VITE_API_URL || '';

export const api = {
    createGame: async (): Promise<{ token: string }> => {
        const response = await fetch(`${API_URL}/api/create`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to create game');
        return response.json();
    },

    joinGame: async (token: string): Promise<{ success: boolean }> => {
        const response = await fetch(`${API_URL}/api/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        if (!response.ok) throw new Error('Failed to join game');
        return response.json();
    },

    checkStatus: async (token: string): Promise<{ status: 'waiting' | 'active' }> => {
        const response = await fetch(`${API_URL}/api/status/${token}`);
        if (!response.ok) throw new Error('Failed to check status');
        return response.json();
    },

    cancelGame: async (token: string): Promise<{ success: boolean }> => {
        const response = await fetch(`${API_URL}/api/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        if (!response.ok) throw new Error('Failed to cancel game');
        return response.json();
    },
};
