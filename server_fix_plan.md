# Fix Token Creation Error - Implementation Plan

## Problem Analysis

The error "Error creating game" with a 500 Internal Server Error occurs because:

1. ✅ The Vite proxy configuration is correct (`vite.config.ts` lines 8-13)
2. ✅ The Express server code is correct (`server/index.js`)
3. ❌ **The Express server is not running** - it needs to run concurrently with the Vite dev server

When you run `npm run server`, the Express server starts and runs in the foreground. If you close that terminal or stop the process, the server stops. Currently, the server is not running, so API calls fail.

## Proposed Solution

Add a script to run both servers concurrently using the `concurrently` package.

### [MODIFY] [package.json](file:///home/lucho/Proyectos/Shogi/package.json)

Add `concurrently` as a dev dependency and create a new script `dev:full` that runs both servers:

```json
{
  "scripts": {
    "dev": "vite",
    "server": "node server/index.js",
    "dev:full": "concurrently \"npm run server\" \"npm run dev\"",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "devDependencies": {
    // ... existing deps
    "concurrently": "^9.1.0"
  }
}
```

## Alternative Solutions

If you prefer not to install `concurrently`:

**Option A:** Run servers in separate terminals
1. Terminal 1: `npm run server` (keep it open)
2. Terminal 2: `npm run dev` (keep it open)

**Option B:** Use `&` to run server in background (Linux/Mac only)
```bash
npm run server &
npm run dev
```

## Verification Plan

### Automated Test
After implementing the fix, verify the API endpoints work:

```bash
# Start both servers
npm run dev:full

# In another terminal, test the API
curl -X POST http://localhost:3000/api/create
# Expected output: {"token":"ABC123"} (6-character alphanumeric token)
```

### Manual Verification
1. Start both servers: `npm run dev:full`
2. Open browser to `http://localhost:5174/Shogi/`
3. Click "🤝 Desafiar a un Amigo"
4. Verify:
   - No error dialog appears
   - You see the waiting room with a 6-character token
   - The token is displayed correctly

> [!IMPORTANT]
> Both the Express server (port 3000) and Vite dev server (port 5174) must be running simultaneously for the multiplayer features to work.
