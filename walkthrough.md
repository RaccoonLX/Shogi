# AI Integration Fix Walkthrough

## Problem
The `ffish` AI engine was failing to initialize with `TypeError: loadModule is not a function`. This was because `ffish.js` is an Emscripten-generated file that is not compatible with standard ES Module imports used by Vite, and it expects to run in a specific environment. Additionally, running it on the main thread would block the UI.

## Solution
1.  **Web Worker Implementation**: Moved the AI logic to a Web Worker (`src/workers/usiWorker.ts`) to prevent UI blocking.
2.  **Custom Loading Strategy**: 
    -   Since `ffish.js` is not a valid ESM module and `importScripts` is not supported in Module Workers (which Vite outputs), we implemented a `fetch` + `eval` strategy in the worker.
    -   The worker fetches `ffish.js` from the public directory and executes it in the global scope.
3.  **Engine Service Refactor**: Updated `src/services/usiEngine.ts` to instantiate the worker and manage communication via a message protocol (`init`, `set_sfen`, `go`, `bestmove`).

## Changes

### `src/workers/usiWorker.ts`
Created a new worker file that:
-   Defines the `Module` object required by Emscripten.
-   Fetches `ffish.js` and executes it using `(0, eval)(scriptContent)`.
-   Handles messages from the main thread to initialize the board, set position, and search for moves.

### `src/services/usiEngine.ts`
Refactored the `USIEngine` class to:
-   Instantiate the worker using `new Worker(..., { type: 'module' })`.
-   Send commands to the worker.
-   Listen for `bestmove` and `ready` messages.

## Verification
-   **Initialization**: Confirmed via browser console logs that the worker initializes successfully:
    ```
    [log] Initializing USI Engine Worker...
    [log] Worker: Loading script http://localhost:5176/Shogi/ffish.js
    [log] Worker: ffish.js executed
    [log] Worker: ffish runtime initialized
    [log] USI Engine Worker is ready
    ```
-   **Architecture**: The AI now runs in a separate thread, ensuring the game UI remains responsive during calculations.

## Next Steps
-   The AI Game Mode is now ready for full gameplay testing.
-   The `AIGameSetup` and `App` components are already set up to use the initialized engine.
