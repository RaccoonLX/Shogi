# Skins System Implementation Plan

## Goal Description
Implement a flexible skins system for Shogi pieces. Users should be able to select from default styles (Classic, English, Symbols) or custom skins loaded from a `skins` directory. Each skin consists of a set of images and a configuration file mapping piece types to images.

## User Review Required
> [!IMPORTANT]
> The `PieceStyle` type will be relaxed from a strict union to `string` to support dynamic skin IDs.

## Proposed Changes

### Configuration & Assets
#### [NEW] [skins.json](file:///home/lucho/Proyectos/Shogi/public/skins/skins.json)
- Global configuration file listing available skins.
- Format: `[{ "id": "skin_id", "name": "Skin Name", "path": "skin_folder" }]`

#### [NEW] [example_skin](file:///home/lucho/Proyectos/Shogi/public/skins/example_skin)
- Directory containing example skin assets.
- `config.json`: Maps piece kinds (FU, KY, etc.) to image filenames.
- Placeholder images for testing.

### Source Code

#### [MODIFY] [PlayerStyleContext.tsx](file:///home/lucho/Proyectos/Shogi/src/contexts/PlayerStyleContext.tsx)
- Update `PieceStyle` type to `string`.
- Add state to store `availableSkins`.
- Fetch `skins.json` on initialization.
- Add helper to check if a style is a skin and get its config.

#### [MODIFY] [StyleSelector.tsx](file:///home/lucho/Proyectos/Shogi/src/components/StyleSelector.tsx)
- Fetch/subscribe to available skins.
- Dynamically render the dropdown options including both default styles and loaded skins.

#### [MODIFY] [Piece.tsx](file:///home/lucho/Proyectos/Shogi/src/components/Piece.tsx)
- Logic to determine if current style is a custom skin.
- If skin: Render `<img>` tag with source from skin config.
- If default: Render existing `PieceShape` and text.
- Ensure images rotate correctly for the opponent.

#### [MODIFY] [pieceDisplay.ts](file:///home/lucho/Proyectos/Shogi/src/utils/pieceDisplay.ts)
- (Optional) Helper functions to resolve skin image paths.

## Verification Plan

### Manual Verification
1.  **Setup**:
    *   Ensure `public/skins/skins.json` exists and is valid.
    *   Ensure `public/skins/example_skin/config.json` and images exist.
2.  **Execution**:
    *   Start the dev server (`npm run dev`).
    *   Open the application in browser.
    *   Open the "Style" dropdown for a player.
    *   **Verify**: "Example Skin" appears in the list.
    *   Select "Example Skin".
    *   **Verify**: Pieces on the board change to the skin images.
    *   **Verify**: Opponent's pieces (if using the same skin) are rotated 180 degrees.
    *   **Verify**: Promoted pieces show the correct promoted image (if defined) or fallback.
