import React from 'react';
import styled from 'styled-components';
import { Piece as PieceComponent } from './Piece';
import { Piece } from 'shogi.js';
import type { IMove } from 'shogi.js';

interface BoardProps {
    board: Piece[][];
    onSquareClick: (x: number, y: number) => void;
    selected: { x: number, y: number } | null;
    possibleMoves: IMove[];
    flipped?: boolean;
}

const BoardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1;
    background-color: #2c2c2c;
    border: 3px solid #1a1a1a;
    margin: 0 auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Square = styled.div<{ $isDark?: boolean }>`
    background-color: ${props => props.$isDark ? '#2c2c2c' : '#d0d0d0'};
    border: 1px solid ${props => props.$isDark ? '#1a1a1a' : '#b0b0b0'};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: ${props => props.$isDark ? '#3a3a3a' : '#e0e0e0'};
    }
`;

const PieceWrapper = styled.div<{ $flipped?: boolean }>`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: ${props => props.$flipped ? 'rotate(180deg)' : 'none'};
`;

export const Board: React.FC<BoardProps> = ({ board, onSquareClick, selected, possibleMoves, flipped = false }) => {
    // Shogi coordinates: x=1-9 (right to left), y=1-9 (top to bottom)
    // But shogi.js board array is 0-indexed: board[0-8][0-8]
    // board[x-1][y-1] to access the piece at logical position (x,y)

    const rows = [];

    if (flipped) {
        // Render for White (Gote) perspective
        // y: 9 -> 1 (top to bottom visually, but logical 9 is bottom)
        // Wait, if flipped, we want logical 9 at the TOP visually?
        // Normal view: Top row is y=1. Bottom row is y=9.
        // Flipped view: Top row should be y=9. Bottom row should be y=1.

        for (let y = 9; y >= 1; y--) {
            for (let x = 1; x <= 9; x++) {
                // Normal view: x goes 9 -> 1 (left to right visually)
                // Flipped view: x goes 1 -> 9 (left to right visually)

                // Convert 1-based coordinates to 0-based array indices
                const piece = board[x - 1]?.[y - 1] || null;
                const isSelected = selected?.x === x && selected?.y === y;
                const isPossibleMove = possibleMoves.some(m => m.to.x === x && m.to.y === y);

                // Alternating pattern
                const isDark = (x + y) % 2 === 0;

                rows.push(
                    <Square key={`${x}-${y}`} $isDark={isDark} onClick={() => onSquareClick(x, y)}>
                        <PieceWrapper $flipped={true}>
                            <PieceComponent
                                kind={piece?.kind}
                                color={piece?.color}
                                isSelected={isSelected}
                                isPossibleMove={isPossibleMove}
                                flipped={true}
                            />
                        </PieceWrapper>
                    </Square>
                );
            }
        }
    } else {
        // Normal view (Black/Sente perspective)
        for (let y = 1; y <= 9; y++) {
            for (let x = 9; x >= 1; x--) {
                const piece = board[x - 1]?.[y - 1] || null;
                const isSelected = selected?.x === x && selected?.y === y;
                const isPossibleMove = possibleMoves.some(m => m.to.x === x && m.to.y === y);

                const isDark = (x + y) % 2 === 0;

                rows.push(
                    <Square key={`${x}-${y}`} $isDark={isDark} onClick={() => onSquareClick(x, y)}>
                        <PieceComponent
                            kind={piece?.kind}
                            color={piece?.color}
                            isSelected={isSelected}
                            isPossibleMove={isPossibleMove}
                            flipped={false}
                        />
                    </Square>
                );
            }
        }
    }

    return (
        <BoardContainer>
            {rows}
        </BoardContainer>
    );
};
