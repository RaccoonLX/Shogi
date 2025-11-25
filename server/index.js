import express from 'express';
import cors from 'cors';

const app = express();

// Simple CORS - allow all origins for testing
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is working!' });
});

// In-memory storage for tokens
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
  console.log('Create endpoint hit');
  let token;
  do {
    token = generateToken();
  } while (tokens.has(token));
  tokens.set(token, { status: 'waiting' });
  console.log('Created token:', token);
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

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Multiplayer server listening on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
