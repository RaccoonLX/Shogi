import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Color } from 'shogi.js';

export type PieceStyle = 'classic' | 'english' | 'symbols';

export interface PieceColors {
    normal: string;
    promoted: string;
}

export const colorPresets: Record<string, PieceColors> = {
    'classic': { normal: '#f5deb3', promoted: '#d32f2f' },
    'blue': { normal: '#90caf9', promoted: '#1976d2' },
    'green': { normal: '#a5d6a7', promoted: '#388e3c' },
    'purple': { normal: '#ce93d8', promoted: '#7b1fa2' },
    'orange': { normal: '#ffcc80', promoted: '#e65100' },
    'pink': { normal: '#f48fb1', promoted: '#c2185b' },
    'teal': { normal: '#80cbc4', promoted: '#00796b' },
    'amber': { normal: '#ffe082', promoted: '#f57c00' },
    'indigo': { normal: '#9fa8da', promoted: '#303f9f' },
    'lime': { normal: '#dce775', promoted: '#827717' },
    'cyan': { normal: '#80deea', promoted: '#0097a7' }
};

export const colorLabels: Record<string, string> = {
    'classic': 'Clásico (Beige/Rojo)',
    'blue': 'Azul',
    'green': 'Verde',
    'purple': 'Púrpura',
    'orange': 'Naranja',
    'pink': 'Rosa',
    'teal': 'Turquesa',
    'amber': 'Ámbar',
    'indigo': 'Índigo',
    'lime': 'Lima',
    'cyan': 'Cian'
};

interface PlayerStyle {
    style: PieceStyle;
    colorPreset: string;
    colors: PieceColors;
}

interface PlayerStyleContextType {
    blackStyle: PlayerStyle;
    whiteStyle: PlayerStyle;
    setBlackStyle: (style: PieceStyle) => void;
    setWhiteStyle: (style: PieceStyle) => void;
    setBlackColorPreset: (preset: string) => void;
    setWhiteColorPreset: (preset: string) => void;
    getStyleForColor: (color: Color) => PlayerStyle;
}

const PlayerStyleContext = createContext<PlayerStyleContextType | undefined>(undefined);

export const PlayerStyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [blackStyle, setBlackStyleState] = useState<PlayerStyle>({
        style: 'classic',
        colorPreset: 'classic',
        colors: colorPresets['classic']
    });

    const [whiteStyle, setWhiteStyleState] = useState<PlayerStyle>({
        style: 'classic',
        colorPreset: 'blue',
        colors: colorPresets['blue']
    });

    const setBlackStyle = (style: PieceStyle) => {
        setBlackStyleState(prev => ({ ...prev, style }));
    };

    const setWhiteStyle = (style: PieceStyle) => {
        setWhiteStyleState(prev => ({ ...prev, style }));
    };

    const setBlackColorPreset = (preset: string) => {
        setBlackStyleState(prev => ({
            ...prev,
            colorPreset: preset,
            colors: colorPresets[preset]
        }));
    };

    const setWhiteColorPreset = (preset: string) => {
        setWhiteStyleState(prev => ({
            ...prev,
            colorPreset: preset,
            colors: colorPresets[preset]
        }));
    };

    const getStyleForColor = (color: Color): PlayerStyle => {
        return color === Color.Black ? blackStyle : whiteStyle;
    };

    return (
        <PlayerStyleContext.Provider value={{
            blackStyle,
            whiteStyle,
            setBlackStyle,
            setWhiteStyle,
            setBlackColorPreset,
            setWhiteColorPreset,
            getStyleForColor
        }}>
            {children}
        </PlayerStyleContext.Provider>
    );
};

export const usePlayerStyle = () => {
    const context = useContext(PlayerStyleContext);
    if (!context) {
        throw new Error('usePlayerStyle must be used within PlayerStyleProvider');
    }
    return context;
};
