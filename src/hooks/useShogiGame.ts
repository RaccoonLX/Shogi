import { useState, useCallback, useEffect } from 'react';
import { Shogi, Color, Piece } from 'shogi.js';
import type { Kind, IMove } from 'shogi.js';

export interface GameState {
    board: Piece[][];
    hands: Piece[][];
    turn: Color;
    selected: { x: number, y: number } | { kind: Kind, color: Color } | null;
    possibleMoves: IMove[];
    status: 'playing' | 'checkmate' | 'draw';
}

interface PendingMove {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

export const useShogiGame = () => {
    const [shogi] = useState(() => new Shogi());
    const [, setVersion] = useState(0);
    const [selected, setSelected] = useState<GameState['selected']>(null);
    const [possibleMoves, setPossibleMoves] = useState<IMove[]>([]);
    const [pendingPromotion, setPendingPromotion] = useState<PendingMove | null>(null);

    const forceUpdate = useCallback(() => setVersion(v => v + 1), []);

    useEffect(() => {
        shogi.initialize();
        forceUpdate();
    }, [shogi, forceUpdate]);

    // Check if a move enters or leaves the promotion zone
    const isPromotionMove = (fromY: number, toY: number, color: Color): boolean => {
        const promotionZone = color === Color.Black ? [1, 2, 3] : [7, 8, 9];
        const fromInZone = promotionZone.includes(fromY);
        const toInZone = promotionZone.includes(toY);
        
        // Promotion is possible if entering or leaving the zone
        return (!fromInZone && toInZone) || (fromInZone && toInZone) || (fromInZone && !toInZone);
    };

    // Check if a piece can be promoted
    const canPromote = (kind: Kind): boolean => {
        // Only unpromoted pieces can be promoted
        return ['FU', 'KY', 'KE', 'GI', 'KA', 'HI'].includes(kind);
    };

    const executeMove = (fromX: number, fromY: number, toX: number, toY: number, promote: boolean) => {
        try {
            shogi.move(fromX, fromY, toX, toY, promote);
            setSelected(null);
            setPossibleMoves([]);
            forceUpdate();
        } catch (e) {
            console.error("Move failed", e);
        }
    };

    const handlePromotionChoice = (promote: boolean) => {
        if (pendingPromotion) {
            const { fromX, fromY, toX, toY } = pendingPromotion;
            executeMove(fromX, fromY, toX, toY, promote);
            setPendingPromotion(null);
        }
    };

    const handleBoardClick = (x: number, y: number) => {
        const piece = shogi.get(x, y);
        const isOwnPiece = piece && piece.color === shogi.turn;

        if (selected) {
            if (isOwnPiece) {
                if ('x' in selected && selected.x === x && selected.y === y) {
                    setSelected(null);
                    setPossibleMoves([]);
                } else {
                    setSelected({ x, y });
                    setPossibleMoves(shogi.getMovesFrom(x, y));
                }
                return;
            }

            try {
                if ('x' in selected) {
                    const move = possibleMoves.find(m => m.to.x === x && m.to.y === y);
                    
                    if (move) {
                        const fromPiece = shogi.get(selected.x, selected.y);
                        
                        // Check if this is a promotion move and piece can be promoted
                        if (fromPiece && 
                            canPromote(fromPiece.kind) && 
                            isPromotionMove(selected.y, y, shogi.turn)) {
                            // Ask for promotion
                            setPendingPromotion({
                                fromX: selected.x,
                                fromY: selected.y,
                                toX: x,
                                toY: y
                            });
                        } else {
                            // Execute move without promotion
                            executeMove(selected.x, selected.y, x, y, false);
                        }
                    } else {
                        setSelected(null);
                        setPossibleMoves([]);
                    }
                } else {
                    // Drop piece - no promotion for drops
                    shogi.drop(x, y, selected.kind!);
                    setSelected(null);
                    setPossibleMoves([]);
                    forceUpdate();
                }
            } catch (e) {
                console.error("Move/drop failed", e);
            }
        } else {
            if (isOwnPiece) {
                setSelected({ x, y });
                setPossibleMoves(shogi.getMovesFrom(x, y));
            }
        }
    };

    const handleHandClick = (kind: Kind, color: Color) => {
        if (color !== shogi.turn) return;
        
        if (selected && !('x' in selected) && selected.kind === kind) {
            setSelected(null);
            setPossibleMoves([]);
            return;
        }

        setSelected({ kind, color });
        const drops = shogi.getDropsBy(color).filter(m => m.kind === kind);
        setPossibleMoves(drops);
    };

    const resetGame = () => {
        shogi.initialize();
        setSelected(null);
        setPossibleMoves([]);
        setPendingPromotion(null);
        forceUpdate();
    };

    return {
        board: shogi.board,
        hands: shogi.hands,
        turn: shogi.turn,
        selected,
        possibleMoves,
        pendingPromotion,
        handleBoardClick,
        handleHandClick,
        handlePromotionChoice,
        resetGame,
        shogi
    };
};
