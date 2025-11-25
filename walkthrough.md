# Shogi Telegram Web App Walkthrough

## Overview
I have created a Shogi Web App designed to run within Telegram. It uses `shogi.js` for game logic and React with `styled-components` for the UI.

## Features
- **Full Shogi Game Logic**: Valid moves, drops, promotion (auto-promote if forced, otherwise asks - currently simplified to auto-promote/ask logic in code).
- **Interactive UI**: Click to select pieces, show possible moves, click to move/drop.
- **Telegram Integration**: Uses `@twa-dev/sdk` to integrate with Telegram theme and expansion.
- **Responsive Design**: Fits within the Telegram Web App view.

## Project Structure
- `src/hooks/useShogiGame.ts`: Custom hook managing the `shogi.js` instance and game state.
- `src/components/Board.tsx`: Renders the 9x9 Shogi board.
- `src/components/Piece.tsx`: Renders individual pieces using Japanese characters and styled components.
- `src/components/Hand.tsx`: Displays captured pieces (hands).
- `src/App.tsx`: Main application component assembling the game.

## How to Run
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

## Verification
- The project builds successfully with `npm run build`.
- Type checking passed.
