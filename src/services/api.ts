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

    getGameState: async (token: string): Promise<{ status: string; moves: any[]; turn: number; board?: any[][]; hands?: any[][] }> => {
        const response = await fetch(`${API_URL}/api/game/${token}`);
        if (!response.ok) throw new Error('Failed to get game state');
        return response.json();
    },

    submitMove: async (token: string, move: any, board: any[][], hands: any[][]): Promise<{ success: boolean; turn: number }> => {
        const response = await fetch(`${API_URL}/api/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, move, board, hands }),
        });
        if (!response.ok) throw new Error('Failed to submit move');
        return response.json();
    },
};
