import React, { useState } from 'react';
import styled from 'styled-components';
import { Color } from 'shogi.js';
import { usePlayerStyle } from '../contexts/PlayerStyleContext';
import type { PieceStyle } from '../contexts/PlayerStyleContext';
import WebApp from '@twa-dev/sdk';

interface StyleSelectorProps {
    player: Color;
}

const SelectorContainer = styled.div`
    position: relative;
`;

const SelectorButton = styled.button<{ $player: Color }>`
    padding: 8px 16px;
    background-color: ${props => props.$player === Color.Black
        ? 'var(--tg-theme-button-color, #2481cc)'
        : 'var(--tg-theme-secondary-bg-color, #efeff3)'};
    color: ${props => props.$player === Color.Black
        ? 'var(--tg-theme-button-text-color, #ffffff)'
        : 'var(--tg-theme-text-color, #000000)'};
    border: ${props => props.$player === Color.White ? '2px solid var(--tg-theme-hint-color, #999)' : 'none'};
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 5px;
    
    &:active {
        opacity: 0.8;
    }
`;

const PlayerIcon = styled.span`
    font-size: 1rem;
`;

const Dropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 5px;
    background-color: var(--tg-theme-bg-color, #ffffff);
    border: 1px solid var(--tg-theme-hint-color, #999);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    min-width: 200px;
    max-height: 300px;
    overflow-y: auto;
`;

const DropdownItem = styled.button<{ $selected?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${props => props.$selected
        ? 'var(--tg-theme-button-color, #2481cc)'
        : 'transparent'};
    color: ${props => props.$selected
        ? 'var(--tg-theme-button-text-color, #ffffff)'
        : 'var(--tg-theme-text-color, #000000)'};
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: ${props => props.$selected
        ? 'var(--tg-theme-button-color, #2481cc)'
        : 'rgba(0, 0, 0, 0.05)'};
    }
`;

const styleLabels: Record<PieceStyle, string> = {
    classic: 'Clásico',
    english: 'Inicial (Inglés)',
    symbols: 'Símbolos (Ajedrez)'
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({ player }) => {
    const { blackStyle, whiteStyle, setBlackStyle, setWhiteStyle } = usePlayerStyle();
    const [isOpen, setIsOpen] = useState(false);

    const currentStyle = player === Color.Black ? blackStyle.style : whiteStyle.style;
    const setStyle = player === Color.Black ? setBlackStyle : setWhiteStyle;
    const playerIcon = player === Color.Black ? '⚫' : '⚪';

    const handleSelect = (newStyle: PieceStyle) => {
        setStyle(newStyle);
        WebApp.HapticFeedback.selectionChanged();
        setIsOpen(false);
    };

    return (
        <SelectorContainer>
            <SelectorButton $player={player} onClick={() => setIsOpen(!isOpen)}>
                <PlayerIcon>{playerIcon}</PlayerIcon>
                Estilo: {styleLabels[currentStyle]} ▼
            </SelectorButton>

            {isOpen && (
                <Dropdown>
                    {(Object.keys(styleLabels) as PieceStyle[]).map(s => (
                        <DropdownItem
                            key={s}
                            $selected={s === currentStyle}
                            onClick={() => handleSelect(s)}
                        >
                            {styleLabels[s]}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}
        </SelectorContainer>
    );
};
