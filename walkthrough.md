# Multiplayer Board Synchronization & Rotation

I have implemented real-time board synchronization, board rotation, and text orientation correction for versus mode.

## Changes

### Board Rotation & Text Orientation
- **Piece Component (`src/components/Piece.tsx`)**:
    - Added `flipped` prop.
    - Adjusted text rotation logic: `transform: ${props => (props.$color === Color.White) !== !!props.$flipped ? 'rotate(180deg)' : 'none'}`.
    - This ensures that for the local player (White in flipped view), the text on their pieces (which are physically rotated to point UP) remains upright and legible.
- **Board Component (`src/components/Board.tsx`)**:
    - Added `flipped` prop.
    - When `flipped` is true:
        - Renders from White's perspective (y: 9->1, x: 1->9).
        - Rotates the piece container 180 degrees.
        - Passes `flipped={true}` to the `Piece` component.
- **App Component (`src/App.tsx`)**:
    - Detects if the current player is White in multiplayer mode.
    - Passes `flipped={true}` to the Board component.
    - Swaps the UI layout so controls/hand are consistent with the player's position.

### Board Synchronization
- **Server (`server/index.js`)**: Stores full board matrix and hands state.
- **Frontend Service (`src/services/api.ts`)**: Sends board/hands on move submission.
- **Game Logic (`src/hooks/useShogiGame.ts`)**: Implements `onMove` callback and `applyMove` for syncing.
- **Polling**: The app polls the server every 2 seconds for game state updates.

## Verification
- **Solo Mode**: Board is standard (Black at bottom).
- **Multiplayer (Black)**: Board is standard (Black at bottom).
- **Multiplayer (White)**:
    - Board is flipped (White pieces at bottom).
    - White pieces point UP (away from player).
    - Black pieces point DOWN (towards player).
    - **Text on White pieces is UPRIGHT (legible).**
    - **Text on Black pieces is UPSIDE DOWN (standard for opponent).**
    - White Hand/Controls are at the bottom.
    - Black Hand/Controls are at the top.
