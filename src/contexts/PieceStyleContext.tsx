import React, { createContext, useContext, useState, type ReactNode } from 'react';

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

interface PieceStyleContextType {
    style: PieceStyle;
    setStyle: (style: PieceStyle) => void;
    colors: PieceColors;
    setColorPreset: (preset: string) => void;
    currentColorPreset: string;
}

const PieceStyleContext = createContext<PieceStyleContextType | undefined>(undefined);

export const PieceStyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [style, setStyle] = useState<PieceStyle>('classic');
    const [currentColorPreset, setCurrentColorPreset] = useState('classic');
    const [colors, setColors] = useState<PieceColors>(colorPresets['classic']);

    const setColorPreset = (preset: string) => {
        setCurrentColorPreset(preset);
        setColors(colorPresets[preset]);
    };

    return (
        <PieceStyleContext.Provider value={{
            style,
            setStyle,
            colors,
            setColorPreset,
            currentColorPreset
        }}>
            {children}
        </PieceStyleContext.Provider>
    );
};

export const usePieceStyle = () => {
    const context = useContext(PieceStyleContext);
    if (!context) {
        throw new Error('usePieceStyle must be used within PieceStyleProvider');
    }
    return context;
};
