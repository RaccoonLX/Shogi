import React, { useState } from 'react';
import styled from 'styled-components';
import { usePieceStyle, colorPresets, colorLabels } from '../contexts/PieceStyleContext';
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
    min-width: 220px;
    max-height: 400px;
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

export const ColorSelector: React.FC = () => {
    const { currentColorPreset, setColorPreset } = usePieceStyle();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (preset: string) => {
        setColorPreset(preset);
        WebApp.HapticFeedback.selectionChanged();
        setIsOpen(false);
    };

    return (
        <SelectorContainer>
            <SelectorButton onClick={() => setIsOpen(!isOpen)}>
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
