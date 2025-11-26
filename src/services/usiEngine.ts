import ffishModule from 'ffish';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export class USIEngine {
    private ffish: any = null;
    private board: any = null;
    private difficulty: AIDifficulty = 'medium';
    private isReady: boolean = false;

    async initialize(): Promise<void> {
        try {
            console.log('Initializing ffish module...');

            // Load the ffish WebAssembly module with locateFile option
            this.ffish = await ffishModule({
                locateFile: (file: string) => {
                    // Point to the WASM file in the public directory
                    return `/Shogi/${file}`;
                }
            });
            console.log('ffish module loaded successfully');

            // Create a new Shogi board
            this.board = new this.ffish.Board('shogi');
            this.isReady = true;
            console.log('USI Engine initialized');
        } catch (error) {
            console.error('Failed to initialize USI engine:', error);
            throw error;
        }
    }

    setDifficulty(difficulty: AIDifficulty): void {
        this.difficulty = difficulty;
    }

    async getBestMove(sfen: string): Promise<string | null> {
        if (!this.isReady || !this.ffish || !this.board) {
            console.error('Engine not ready');
            return null;
        }

        try {
            // Set the position from SFEN
            this.board.setSfen(sfen);

            // Get search depth based on difficulty
            const depth = this.getDepthForDifficulty();

            console.log(`Getting best move with depth ${depth} for position: ${sfen}`);

            // Get the best move
            const move = this.board.bestMove(depth);

            if (!move) {
                console.log('No legal moves available');
                return null;
            }

            console.log(`Best move found: ${move}`);
            return move;
        } catch (error) {
            console.error('Error getting best move:', error);
            return null;
        }
    }

    private getDepthForDifficulty(): number {
        switch (this.difficulty) {
            case 'easy':
                return 1; // Very shallow search
            case 'medium':
                return 3; // Moderate search
            case 'hard':
                return 5; // Deep search
            default:
                return 3;
        }
    }

    getCurrentSfen(): string {
        if (!this.board) {
            return 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1'; // Starting position
        }
        return this.board.sfen();
    }

    makeMove(move: string): boolean {
        if (!this.board) {
            console.error('Board not initialized');
            return false;
        }

        try {
            this.board.push(move);
            return true;
        } catch (error) {
            console.error('Failed to make move:', error);
            return false;
        }
    }

    reset(): void {
        if (this.board) {
            this.board.reset();
        }
    }

    stop(): void {
        // Clean up resources
        if (this.board) {
            this.board.delete();
            this.board = null;
        }
        this.isReady = false;
    }

    // Convert USI move notation to our internal format
    parseUSIMove(usiMove: string): { fromX?: number; fromY?: number; toX: number; toY: number; promote: boolean; piece?: string } | null {
        try {
            // USI format examples:
            // "7g7f" - normal move from 7g to 7f
            // "7g7f+" - promoting move
            // "P*5e" - drop pawn at 5e

            if (usiMove.includes('*')) {
                // Drop move: piece*square
                const parts = usiMove.split('*');
                const piece = parts[0];
                const square = parts[1];
                const { x, y } = this.parseSquare(square);
                return { toX: x, toY: y, promote: false, piece };
            } else {
                // Regular move
                const promote = usiMove.endsWith('+');
                const moveStr = promote ? usiMove.slice(0, -1) : usiMove;

                if (moveStr.length < 4) {
                    console.error('Invalid USI move format:', usiMove);
                    return null;
                }

                const fromSquare = moveStr.substring(0, 2);
                const toSquare = moveStr.substring(2, 4);

                const from = this.parseSquare(fromSquare);
                const to = this.parseSquare(toSquare);

                return {
                    fromX: from.x,
                    fromY: from.y,
                    toX: to.x,
                    toY: to.y,
                    promote
                };
            }
        } catch (error) {
            console.error('Error parsing USI move:', error);
            return null;
        }
    }

    // Parse square notation like "7g" to coordinates
    private parseSquare(square: string): { x: number; y: number } {
        // USI uses format like "7g" where:
        // - First char is file (9-1 from left to right)
        // - Second char is rank (a-i from top to bottom)

        const file = parseInt(square[0]);
        const rank = square[1];

        // Convert file: 9->1, 8->2, ..., 1->9
        const x = 10 - file;

        // Convert rank: a->1, b->2, ..., i->9
        const y = rank.charCodeAt(0) - 'a'.charCodeAt(0) + 1;

        return { x, y };
    }

    // Convert internal coordinates to USI square notation
    coordinatesToUSI(x: number, y: number): string {
        // Convert x: 1->9, 2->8, ..., 9->1
        const file = 10 - x;

        // Convert y: 1->a, 2->b, ..., 9->i
        const rank = String.fromCharCode('a'.charCodeAt(0) + y - 1);

        return `${file}${rank}`;
    }

    // Convert our move to USI format
    moveToUSI(fromX?: number, fromY?: number, toX?: number, toY?: number, promote: boolean = false, piece?: string): string {
        if (piece && toX !== undefined && toY !== undefined) {
            // Drop move
            return `${piece}*${this.coordinatesToUSI(toX, toY)}`;
        } else if (fromX !== undefined && fromY !== undefined && toX !== undefined && toY !== undefined) {
            // Regular move
            const from = this.coordinatesToUSI(fromX, fromY);
            const to = this.coordinatesToUSI(toX, toY);
            return `${from}${to}${promote ? '+' : ''}`;
        }
        return '';
    }
}

export const usiEngine = new USIEngine();
