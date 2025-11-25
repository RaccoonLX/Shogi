# Implementation Plan - Main Menu and Multiplayer

This plan outlines the steps to implement the Main Menu, Multiplayer logic using tokens, and the necessary backend support.

## User Review Required

> [!IMPORTANT]
> **Backend Requirement**: To support "Online Multiplayer", a backend server is required to store tokens and manage game sessions. I will create a simple Node.js server in a `server` directory. You will need to run this server alongside the Vite development server.

## Proposed Changes

### Backend
#### [NEW] [server/index.js](file:///home/lucho/Proyectos/Shogi/server/index.js)
- Simple Express server.
- In-memory storage for active game tokens.
- Endpoints:
    - `POST /api/create`: Generates a 6-digit token and waits for a player.
    - `POST /api/join`: Validates token and pairs players.
    - `POST /api/cancel`: Removes the token.
    - `GET /api/status/:token`: Checks if a second player has joined (long polling or simple polling).

### Frontend - Components

#### [NEW] [src/components/MainMenu.tsx](file:///home/lucho/Proyectos/Shogi/src/components/MainMenu.tsx)
- Displays the three main options:
    - Challenge a Friend (Generate Token)
    - Accept Challenge (Enter Token)
    - Play Solo

#### [NEW] [src/components/WaitingRoom.tsx](file:///home/lucho/Proyectos/Shogi/src/components/WaitingRoom.tsx)
- Displays the generated token.
- Shows "Waiting for friend..." message.
- "Cancel" button.

#### [NEW] [src/services/api.ts](file:///home/lucho/Proyectos/Shogi/src/services/api.ts)
- Functions to interact with the backend (`createGame`, `joinGame`, `checkStatus`, `cancelGame`).

### Frontend - Main Logic

#### [MODIFY] [src/App.tsx](file:///home/lucho/Proyectos/Shogi/src/App.tsx)
- Add state for `view` ('menu', 'waiting', 'game').
- Add state for `gameMode` ('solo', 'multiplayer').
- Add state for `playerColor` (for multiplayer restriction).
- Implement navigation logic.
- Integrate `MainMenu` and `WaitingRoom`.
- Add "Exit" button in the Game view.

#### [MODIFY] [src/hooks/useShogiGame.ts](file:///home/lucho/Proyectos/Shogi/src/hooks/useShogiGame.ts)
- (Optional) Modify to accept `playerColor` to restrict moves, or handle this in `App.tsx` by passing a `readOnly` or `isMyTurn` prop to `Board` and `Hand`.
- Actually, it's better to handle the restriction in `App.tsx` by checking `turn === playerColor` before calling `handleBoardClick`.

#### [MODIFY] [vite.config.ts](file:///home/lucho/Proyectos/Shogi/vite.config.ts)
- Add proxy configuration to forward `/api` requests to the local backend server (e.g., port 3000).

## Verification Plan

### Automated Tests
- None planned for this iteration.

### Manual Verification
1.  **Solo Mode**: Click "Play Solo", verify the game loads and works as before. Click "Exit" to return to menu.
2.  **Create Game**: Click "Challenge Friend", verify token is shown.
3.  **Cancel Game**: Click "Cancel", verify return to menu.
4.  **Join Game**:
    - Open two browser tabs.
    - Tab 1: Create Game. Copy token.
    - Tab 2: Join Game. Paste token.
    - Verify both tabs enter the game.
    - Verify Tab 1 is Sente (Black) and Tab 2 is Gote (White).
    - Verify Tab 1 can only move Black pieces.
    - Verify Tab 2 can only move White pieces.
