import React, { useState } from 'react';
import styled from 'styled-components';
import { Color } from 'shogi.js';
import { usePlayerStyle, colorPresets, colorLabels } from '../contexts/PlayerStyleContext';
import WebApp from '@twa-dev/sdk';

interface ColorSelectorProps {
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
    min-width: 220px;
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
    display: flex;
    align-items: center;
    gap: 10px;
    
    &:hover {
        background-color: ${props => props.$selected
        ? 'var(--tg-theme-button-color, #2481cc)'
        : 'rgba(0, 0, 0, 0.05)'};
    }
`;

const ColorPreview = styled.div<{ $normal: string; $promoted: string }>`
    display: flex;
    gap: 3px;
`;

const ColorSwatch = styled.div<{ $color: string }>`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: ${props => props.$color};
    border: 1px solid rgba(0, 0, 0, 0.2);
`;

export const ColorSelector: React.FC<ColorSelectorProps> = ({ player }) => {
    const { blackStyle, whiteStyle, setBlackColorPreset, setWhiteColorPreset } = usePlayerStyle();
    const [isOpen, setIsOpen] = useState(false);

    const currentColorPreset = player === Color.Black ? blackStyle.colorPreset : whiteStyle.colorPreset;
    const setColorPreset = player === Color.Black ? setBlackColorPreset : setWhiteColorPreset;
    const playerIcon = player === Color.Black ? '⚫' : '⚪';

    const handleSelect = (preset: string) => {
        setColorPreset(preset);
        WebApp.HapticFeedback.selectionChanged();
        setIsOpen(false);
    };

    return (
        <SelectorContainer>
            <SelectorButton $player={player} onClick={() => setIsOpen(!isOpen)}>
                <PlayerIcon>{playerIcon}</PlayerIcon>
                Color ▼
            </SelectorButton>

            {isOpen && (
                <Dropdown>
                    {Object.keys(colorPresets).map(preset => (
                        <DropdownItem
                            key={preset}
                            $selected={preset === currentColorPreset}
                            onClick={() => handleSelect(preset)}
                        >
                            <ColorPreview
                                $normal={colorPresets[preset].normal}
                                $promoted={colorPresets[preset].promoted}
                            >
                                <ColorSwatch $color={colorPresets[preset].normal} />
                                <ColorSwatch $color={colorPresets[preset].promoted} />
                            </ColorPreview>
                            {colorLabels[preset]}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}
        </SelectorContainer>
    );
};
