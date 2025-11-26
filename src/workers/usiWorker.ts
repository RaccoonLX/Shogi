/// <reference lib="webworker" />

declare global {
    interface Window {
        Module: any;
        ffish: any;
    }
}

// Define the message types
type WorkerMessage =
    | { type: 'init' }
    | { type: 'set_sfen', sfen: string }
    | { type: 'go', depth: number }
    | { type: 'stop' };

type MainMessage =
    | { type: 'ready' }
    | { type: 'bestmove', move: string }
    | { type: 'error', message: string }
    | { type: 'log', message: string };

// Helper to send messages back to main thread
const sendMessage = (msg: MainMessage) => {
    self.postMessage(msg);
};

let ffish: any = null;
let board: any = null;
let isReady = false;

// Initialize the ffish module
const initializeEngine = async () => {
    if (isReady) {
        sendMessage({ type: 'ready' });
        return;
    }

    try {
        sendMessage({ type: 'log', message: 'Worker: Initializing ffish...' });

        // Get base URL from environment (injected by Vite)
        const baseUrl = import.meta.env.BASE_URL;
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const origin = self.location.origin;

        // Setup Module object for Emscripten
        (self as any).Module = {
            locateFile: (file: string) => {
                const cleanFile = file.startsWith('/') ? file.slice(1) : file;
                const fullPath = `${origin}${cleanBaseUrl}${cleanFile}`;
                sendMessage({ type: 'log', message: `Worker locateFile: ${file} -> ${fullPath}` });
                return fullPath;
            },
            onRuntimeInitialized: () => {
                sendMessage({ type: 'log', message: 'Worker: ffish runtime initialized' });
                ffish = (self as any).Module;
                try {
                    board = new ffish.Board('shogi');
                    isReady = true;
                    sendMessage({ type: 'ready' });
                } catch (err) {
                    sendMessage({ type: 'error', message: `Failed to create board: ${err}` });
                }
            },
            print: (text: string) => sendMessage({ type: 'log', message: `[ffish stdout]: ${text}` }),
            printErr: (text: string) => sendMessage({ type: 'log', message: `[ffish stderr]: ${text}` }),
        };

        // Load ffish.js using fetch and eval to avoid importScripts issues in module workers
        const scriptUrl = `${origin}${cleanBaseUrl}ffish.js`;
        sendMessage({ type: 'log', message: `Worker: Loading script ${scriptUrl}` });

        try {
            const response = await fetch(scriptUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${scriptUrl}: ${response.status} ${response.statusText}`);
            }
            const scriptContent = await response.text();

            // Execute the script in global scope
            // Indirect eval to execute in global scope
            (0, eval)(scriptContent);

            sendMessage({ type: 'log', message: 'Worker: ffish.js executed' });
        } catch (e) {
            sendMessage({ type: 'error', message: `Failed to load script: ${e}` });
        }

    } catch (error) {
        sendMessage({ type: 'error', message: `Worker initialization error: ${error}` });
    }
};

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const msg = e.data;

    switch (msg.type) {
        case 'init':
            await initializeEngine();
            break;

        case 'set_sfen':
            if (!isReady || !board) {
                sendMessage({ type: 'error', message: 'Engine not ready' });
                return;
            }
            try {
                board.setSfen(msg.sfen);
            } catch (err) {
                sendMessage({ type: 'error', message: `Invalid SFEN: ${err}` });
            }
            break;

        case 'go':
            if (!isReady || !board) {
                sendMessage({ type: 'error', message: 'Engine not ready' });
                return;
            }
            try {
                const depth = msg.depth || 3;
                const move = board.bestMove(depth);
                sendMessage({ type: 'bestmove', move: move || 'resign' });
            } catch (err) {
                sendMessage({ type: 'error', message: `Search error: ${err}` });
            }
            break;

        case 'stop':
            // Not much to do here for synchronous search, but good for cleanup if we had async
            break;
    }
};
