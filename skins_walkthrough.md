# Skins System Implementation Walkthrough

## Overview
Implemented a flexible skins system that allows users to select custom image-based piece skins in addition to the default text-based styles (Classic, English, Symbols).

## Changes Made

### Directory Structure
Created the following directory structure:
```
public/skins/
├── skins.json
└── example_skin/
    ├── config.json
    ├── pawn.png
    ├── lance.png
    ├── knight.png
    ├── silver.png
    ├── gold.png
    ├── bishop.png
    ├── rook.png
    ├── king.png
    ├── pawn_promoted.png
    ├── lance_promoted.png
    ├── knight_promoted.png
    ├── silver_promoted.png
    ├── bishop_promoted.png
    └── rook_promoted.png
```

### Configuration Files

#### [skins.json](file:///home/lucho/Proyectos/Shogi/public/skins/skins.json)
Global configuration listing all available skins:
```json
[
  {
    "id": "example_skin",
    "name": "Skin de Ejemplo",
    "path": "example_skin"
  }
]
```

#### [example_skin/config.json](file:///home/lucho/Proyectos/Shogi/public/skins/example_skin/config.json)
Maps piece kinds to image filenames for the example skin.

### Code Changes

#### [PlayerStyleContext.tsx](file:///home/lucho/Proyectos/Shogi/src/contexts/PlayerStyleContext.tsx)
- Changed `PieceStyle` type from strict union to `string` to support dynamic skin IDs
- Added `availableSkins` state to store loaded skins
- Added `skinConfigs` state to cache skin configurations
- Implemented `useEffect` to fetch and load skins on mount
- Added `getSkinConfig()` helper to retrieve skin configuration by ID
- Exported `availableSkins` and `getSkinConfig` in context

#### [Piece.tsx](file:///home/lucho/Proyectos/Shogi/src/components/Piece.tsx)
- Added skin detection logic using `getSkinConfig()`
- Implemented conditional rendering:
  - **Custom skin**: Renders `<img>` tag with source from skin config
  - **Default style**: Renders traditional `PieceShape` with text
- Images rotate 180° for opponent perspective (using `flipped` prop)
- Maintained backward compatibility with existing text-based styles

#### [StyleSelector.tsx](file:///home/lucho/Proyectos/Shogi/src/components/StyleSelector.tsx)
- Replaced hardcoded `styleLabels` with `defaultStyleLabels`
- Added `availableSkins` from context
- Built combined list of default styles and custom skins
- Implemented `getCurrentStyleName()` helper for display
- Dropdown now shows both default and custom skins dynamically

## How It Works

1. **Loading**: On app startup, `PlayerStyleContext` fetches `/skins/skins.json`
2. **Config**: For each skin, it loads the `config.json` mapping pieces to images
3. **Selection**: Users select a skin from the "Estilo" dropdown
4. **Rendering**: `Piece` component checks if current style is a skin:
   - If yes: renders image from `/skins/{skin_id}/{piece_image}`
   - If no: renders traditional styled text

## Adding New Skins

To add a new skin:

1. Create a new folder in `public/skins/` (e.g., `my_custom_skin/`)
2. Add a `config.json` mapping all piece kinds to image filenames
3. Add all required images (14 total: 8 pieces + 6 promoted)
4. Update `public/skins/skins.json` to include the new skin:
   ```json
   {
     "id": "my_custom_skin",
     "name": "My Custom Skin",
     "path": "my_custom_skin"
   }
   ```
5. Restart the dev server to reload configurations

## Testing

The implementation is complete and ready for testing. To verify:

1. Start the dev server
2. Open the game interface
3. Click on a player's "Estilo" dropdown
4. Select "Skin de Ejemplo"
5. Verify pieces change to placeholder images
6. Check that opponent pieces are rotated correctly

## Notes

- Placeholder images are currently used for the example skin (all pieces use the same gray square)
- Replace these with actual piece artwork for production use
- Images should ideally be transparent PNGs, square aspect ratio
- Recommended size: 128x128px or 256x256px for crisp rendering
