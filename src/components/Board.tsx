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

export const Board: React.FC<BoardProps> = ({ board, onSquareClick, selected, possibleMoves }) => {
    // Shogi coordinates: x=1-9 (right to left), y=1-9 (top to bottom)
    // But shogi.js board array is 0-indexed: board[0-8][0-8]
    // board[x-1][y-1] to access the piece at logical position (x,y)
    
    const rows = [];
    for (let y = 1; y <= 9; y++) {
        for (let x = 9; x >= 1; x--) {
            // Convert 1-based coordinates to 0-based array indices
            const piece = board[x - 1]?.[y - 1] || null;
            const isSelected = selected?.x === x && selected?.y === y;
            const isPossibleMove = possibleMoves.some(m => m.to.x === x && m.to.y === y);
            
            // Alternating pattern: (x + y) % 2 determines if square is dark
            const isDark = (x + y) % 2 === 0;
            
            rows.push(
                <Square key={`${x}-${y}`} $isDark={isDark} onClick={() => onSquareClick(x, y)}>
                    <PieceComponent 
                        kind={piece?.kind} 
                        color={piece?.color} 
                        isSelected={isSelected}
                        isPossibleMove={isPossibleMove}
                    />
                </Square>
            );
        }
    }

    return (
        <BoardContainer>
            {rows}
        </BoardContainer>
    );
};
