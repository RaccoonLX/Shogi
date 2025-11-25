import express from 'express';
import cors from 'cors';

const app = express();

// Configure CORS to allow requests from both local development and GitHub Pages
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://raccoonlx.github.io'
  ],
  credentials: true
}));

app.use(express.json());

// In-memory storage for tokens
// token -> { status: 'waiting' | 'active' }
const tokens = new Map();

// Helper to generate 6-digit alphanumeric token
function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Create a new game token
app.post('/api/create', (req, res) => {
  let token;
  do {
    token = generateToken();
  } while (tokens.has(token));
  tokens.set(token, { status: 'waiting' });
  res.json({ token });
});

// Join an existing game token
app.post('/api/join', (req, res) => {
  const { token } = req.body;
  if (!token || !tokens.has(token)) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  const game = tokens.get(token);
  if (game.status !== 'waiting') {
    return res.status(400).json({ error: 'Game already started or invalid' });
  }
  // Mark as active
  game.status = 'active';
  tokens.set(token, game);
  res.json({ success: true });
});

// Check status of a token
app.get('/api/status/:token', (req, res) => {
  const { token } = req.params;
  if (!tokens.has(token)) {
    return res.status(404).json({ error: 'Token not found' });
  }
  const game = tokens.get(token);
  res.json({ status: game.status });
});

// Cancel a game token
app.post('/api/cancel', (req, res) => {
  const { token } = req.body;
  if (token && tokens.has(token)) {
    tokens.delete(token);
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid token' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Multiplayer server listening on port ${PORT}`);
});
