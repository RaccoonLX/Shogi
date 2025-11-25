import React from 'react';
import styled from 'styled-components';
import { Piece, Color } from 'shogi.js';
import type { Kind } from 'shogi.js';
import { Piece as PieceComponent } from './Piece';

interface HandProps {
    hands: Piece[][];
    color: Color;
    onPieceClick: (kind: Kind, color: Color) => void;
    selected: { kind: Kind, color: Color } | null;
}

const HandContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 10px;
    background-color: #f0d9b5;
    border: 1px solid #5c4033;
    min-height: 50px;
    align-items: center;
`;

const HandPieceWrapper = styled.div`
    width: 40px;
    height: 40px;
    position: relative;
`;

const Count = styled.span`
    position: absolute;
    bottom: -5px;
    right: -5px;
    font-size: 0.8rem;
    background: white;
    border-radius: 50%;
    padding: 2px 5px;
    border: 1px solid black;
`;

export const Hand: React.FC<HandProps> = ({ hands, color, onPieceClick, selected }) => {
    // hands[color] is an array of Pieces.
    // We want to group them by kind.
    const myHand = hands[color] || [];
    const counts: Record<string, number> = {};
    const samplePiece: Record<string, Piece> = {};

    myHand.forEach(p => {
        counts[p.kind] = (counts[p.kind] || 0) + 1;
        samplePiece[p.kind] = p;
    });

    const kinds = Object.keys(counts) as Kind[];

    return (
        <HandContainer>
            {kinds.map(kind => (
                <HandPieceWrapper key={kind} onClick={() => onPieceClick(kind, color)}>
                    <PieceComponent 
                        kind={kind} 
                        color={color} 
                        isSelected={selected?.kind === kind && selected?.color === color}
                    />
                    {counts[kind] > 1 && <Count>{counts[kind]}</Count>}
                </HandPieceWrapper>
            ))}
        </HandContainer>
    );
};
