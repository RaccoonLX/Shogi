export type AIDifficulty = 'easy' | 'medium' | 'hard';

export class USIEngine {
    private worker: Worker | null = null;
    private difficulty: AIDifficulty = 'medium';
    private isReady: boolean = false;
    private initializationPromise: Promise<void> | null = null;
    private currentSearchResolve: ((move: string | null) => void) | null = null;

    async initialize(): Promise<void> {
        if (this.isReady) return;
        if (this.initializationPromise) return this.initializationPromise;

        this.initializationPromise = new Promise((resolve, reject) => {
            console.log('Initializing USI Engine Worker...');

            try {
                // Instantiate the worker
                // We use type: 'module' because Vite outputs ESM workers
                this.worker = new Worker(new URL('../workers/usiWorker.ts', import.meta.url), {
                    type: 'module'
                });

                this.worker.onmessage = (e) => {
                    const msg = e.data;
                    switch (msg.type) {
                        case 'ready':
                            console.log('USI Engine Worker is ready');
                            this.isReady = true;
                            resolve();
                            break;
                        case 'bestmove':
                            console.log('Received bestmove from worker:', msg.move);
                            if (this.currentSearchResolve) {
                                this.currentSearchResolve(msg.move === 'resign' ? null : msg.move);
                                this.currentSearchResolve = null;
                            }
                            break;
                        case 'error':
                            console.error('Worker error:', msg.message);
                            if (!this.isReady) {
                                reject(new Error(msg.message));
                            }
                            break;
                        case 'log':
                            console.log(msg.message);
                            break;
                    }
                };

                this.worker.onerror = (e) => {
                    console.error('Worker error event:', e);
                    console.error('Worker error message:', e.message);
                    console.error('Worker error filename:', e.filename);
                    console.error('Worker error lineno:', e.lineno);
                    reject(new Error(`Worker error: ${e.message} at ${e.filename}:${e.lineno}`));
                };

                // Send init command
                this.worker.postMessage({ type: 'init' });

            } catch (error) {
                console.error('Failed to create worker:', error);
                reject(error);
            }
        });

        return this.initializationPromise;
    }

    setDifficulty(difficulty: AIDifficulty): void {
        this.difficulty = difficulty;
    }

    async getBestMove(sfen: string): Promise<string | null> {
        if (!this.isReady || !this.worker) {
            console.error('Engine not ready');
            return null;
        }

        // Cancel any pending search
        if (this.currentSearchResolve) {
            this.currentSearchResolve(null);
            this.currentSearchResolve = null;
        }

        return new Promise((resolve) => {
            this.currentSearchResolve = resolve;

            // Update position
            this.worker!.postMessage({ type: 'set_sfen', sfen });

            // Start search
            const depth = this.getDepthForDifficulty();
            console.log(`Requesting best move with depth ${depth} for position: ${sfen}`);
            this.worker!.postMessage({ type: 'go', depth });
        });
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

    stop(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.isReady = false;
        this.initializationPromise = null;
        this.currentSearchResolve = null;
    }

    // Helper methods for move parsing (stateless, can remain here)

    // Convert USI move notation to our internal format
    parseUSIMove(usiMove: string): { fromX?: number; fromY?: number; toX: number; toY: number; promote: boolean; piece?: string } | null {
        try {
            if (!usiMove) return null;

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
        const file = parseInt(square[0]);
        const rank = square[1];
        const x = 10 - file;
        const y = rank.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        return { x, y };
    }

    // Convert internal coordinates to USI square notation
    coordinatesToUSI(x: number, y: number): string {
        const file = 10 - x;
        const rank = String.fromCharCode('a'.charCodeAt(0) + y - 1);
        return `${file}${rank}`;
    }

    // Convert our move to USI format
    moveToUSI(fromX?: number, fromY?: number, toX?: number, toY?: number, promote: boolean = false, piece?: string): string {
        if (piece && toX !== undefined && toY !== undefined) {
            return `${piece}*${this.coordinatesToUSI(toX, toY)}`;
        } else if (fromX !== undefined && fromY !== undefined && toX !== undefined && toY !== undefined) {
            const from = this.coordinatesToUSI(fromX, fromY);
            const to = this.coordinatesToUSI(toX, toY);
            return `${from}${to}${promote ? '+' : ''}`;
        }
        return '';
    }
}

export const usiEngine = new USIEngine();
