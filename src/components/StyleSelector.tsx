import React, { useState } from 'react';
import styled from 'styled-components';
import { usePieceStyle } from '../contexts/PieceStyleContext';
import type { PieceStyle } from '../contexts/PieceStyleContext';
import WebApp from '@twa-dev/sdk';

const SelectorContainer = styled.div`
    position: relative;
`;

const SelectorButton = styled.button`
    padding: 8px 16px;
    background-color: var(--tg-theme-button-color, #2481cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 5px;
    
    &:active {
        opacity: 0.8;
    }
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
    overflow: hidden;
    z-index: 1000;
    min-width: 200px;
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

export const StyleSelector: React.FC = () => {
    const { style, setStyle } = usePieceStyle();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (newStyle: PieceStyle) => {
        setStyle(newStyle);
        WebApp.HapticFeedback.selectionChanged();
        setIsOpen(false);
    };

    return (
        <SelectorContainer>
            <SelectorButton onClick={() => setIsOpen(!isOpen)}>
                Estilo: {styleLabels[style]} ▼
            </SelectorButton>

            {isOpen && (
                <Dropdown>
                    {(Object.keys(styleLabels) as PieceStyle[]).map(s => (
                        <DropdownItem
                            key={s}
                            $selected={s === style}
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
