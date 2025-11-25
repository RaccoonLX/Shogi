import React, { useState } from 'react';
import { Color } from 'shogi.js';
import type { Kind } from 'shogi.js';
import styled from 'styled-components';
import { Tooltip } from './Tooltip';
import { usePlayerStyle } from '../contexts/PlayerStyleContext';
import { getPieceDisplay } from '../utils/pieceDisplay';

interface PieceProps {
    kind?: Kind;
    color?: Color;
    onClick?: () => void;
    isSelected?: boolean;
    isPossibleMove?: boolean;
    isLastMove?: boolean;
    flipped?: boolean;
}

const PieceContainer = styled.div<{
    $color?: Color;
    $isSelected?: boolean;
    $isPossibleMove?: boolean;
    $isLastMove?: boolean;
    $isPromoted?: boolean;
}>`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        width: 30%;
        height: 30%;
        background-color: ${props => props.$isPossibleMove ? 'rgba(0, 255, 0, 0.6)' : 'transparent'};
        border-radius: 50%;
        z-index: 1;
    }
`;

const PieceShape = styled.div<{
    $color?: Color;
    $isSelected?: boolean;
    $bgColor: string;
    $borderColor: string;
}>`
    width: 80%;
    height: 85%;
    background-color: ${props => props.$bgColor};
    border: 2px solid ${props => props.$borderColor};
    clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%);
    display: flex;
    justify-content: center;
    align-items: center;
    transform: ${props => props.$color === Color.White ? 'rotate(180deg)' : 'none'};
    box-shadow: ${props => props.$isSelected
        ? '0 0 0 3px #ffd700, 0 4px 8px rgba(0,0,0,0.3)'
        : '0 2px 4px rgba(0,0,0,0.2)'};
    transition: box-shadow 0.2s;
    position: relative;
    
    &:hover {
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
    }
`;

const PieceText = styled.span<{ $color?: Color; $isPromoted?: boolean; $flipped?: boolean }>`
    font-family: 'Noto Serif JP', serif;
    font-size: 1.2rem;
    font-weight: bold;
    user-select: none;
    color: ${props => props.$isPromoted ? '#ffffff' : '#000000'};
    transform: ${props => (props.$color === Color.White) !== !!props.$flipped ? 'rotate(180deg)' : 'none'};
    text-shadow: ${props => props.$isPromoted ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'};
`;

// Promoted pieces
const promotedPieces = ['TO', 'NY', 'NK', 'NG', 'UM', 'RY'];

// Darken color for border
const darkenColor = (color: string): string => {
    // Simple darkening by reducing brightness
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const factor = 0.6;
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

export const Piece: React.FC<PieceProps> = ({ kind, color, onClick, isSelected, isPossibleMove, isLastMove, flipped }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const { getStyleForColor, getSkinConfig } = usePlayerStyle();

    if (!kind || color === undefined) {
        return (
            <PieceContainer
                $isSelected={isSelected}
                $isPossibleMove={isPossibleMove}
                $isLastMove={isLastMove}
                onClick={onClick}
            />
        );
    }

    const playerStyle = getStyleForColor(color);
    const skinConfig = getSkinConfig(playerStyle.style);
    const isCustomSkin = !!skinConfig;
    const imageFile = isCustomSkin ? skinConfig?.[kind] : null;
    const text = isCustomSkin ? '' : getPieceDisplay(kind, playerStyle.style);
    const isPromoted = promotedPieces.includes(kind);
    const bgColor = isCustomSkin ? '' : (isPromoted ? playerStyle.colors.promoted : playerStyle.colors.normal);
    const borderColor = isCustomSkin ? '' : darkenColor(bgColor);

    return (
        <PieceContainer
            $color={color}
            $isSelected={isSelected}
            $isPossibleMove={isPossibleMove}
            $isLastMove={isLastMove}
            $isPromoted={isPromoted}
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {isCustomSkin && imageFile ? (
                <img
                    src={`${import.meta.env.BASE_URL}skins/${playerStyle.style}/${imageFile}`}
                    alt={kind}
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: flipped ? 'rotate(180deg)' : 'none',
                        objectFit: 'contain',
                    }}
                />
            ) : (
                <PieceShape
                    $color={color}
                    $isSelected={isSelected}
                    $bgColor={bgColor}
                    $borderColor={borderColor}
                >
                    <PieceText $color={color} $isPromoted={isPromoted} $flipped={flipped}>
                        {text}
                    </PieceText>
                </PieceShape>
            )}
            {/* Only show tooltip if not selected */}
            {showTooltip && !isSelected && <Tooltip kind={kind} />}
        </PieceContainer>
    );
};
