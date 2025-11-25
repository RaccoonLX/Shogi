import type { Kind } from 'shogi.js';
import type { PieceStyle } from '../contexts/PieceStyleContext';

// Classic Japanese characters
export const classicMap: Record<string, string> = {
    'FU': '歩',
    'KY': '香',
    'KE': '桂',
    'GI': '銀',
    'KI': '金',
    'KA': '角',
    'HI': '飛',
    'OU': '王',
    'TO': 'と',
    'NY': '杏',
    'NK': '圭',
    'NG': '全',
    'UM': '馬',
    'RY': '龍'
};

// English initials
export const englishMap: Record<string, string> = {
    'FU': 'P',   // Pawn
    'KY': 'L',   // Lance
    'KE': 'N',   // Knight
    'GI': 'S',   // Silver
    'KI': 'G',   // Gold
    'KA': 'B',   // Bishop
    'HI': 'R',   // Rook
    'OU': 'K',   // King
    'TO': '+P',  // Promoted Pawn
    'NY': '+L',  // Promoted Lance
    'NK': '+N',  // Promoted Knight
    'NG': '+S',  // Promoted Silver
    'UM': '+B',  // Promoted Bishop
    'RY': '+R'   // Promoted Rook
};

// Chess-style symbols (using Unicode chess pieces)
export const symbolsMap: Record<string, string> = {
    'FU': '♟',   // Pawn
    'KY': '🗼',  // Lance (tower-like)
    'KE': '♞',   // Knight
    'GI': '⚔',   // Silver (sword)
    'KI': '👑',  // Gold (crown)
    'KA': '♝',   // Bishop
    'HI': '♜',   // Rook
    'OU': '♚',   // King
    'TO': '♟⁺',  // Promoted Pawn
    'NY': '🗼⁺', // Promoted Lance
    'NK': '♞⁺',  // Promoted Knight
    'NG': '⚔⁺',  // Promoted Silver
    'UM': '♝⁺',  // Promoted Bishop
    'RY': '♜⁺'   // Promoted Rook
};

export const getPieceDisplay = (kind: Kind, style: PieceStyle): string => {
    switch (style) {
        case 'classic':
            return classicMap[kind] || kind;
        case 'english':
            return englishMap[kind] || kind;
        case 'symbols':
            return symbolsMap[kind] || kind;
        default:
            return classicMap[kind] || kind;
    }
};
