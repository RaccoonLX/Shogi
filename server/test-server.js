import http from 'http';

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from basic server!' }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Basic server listening on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
