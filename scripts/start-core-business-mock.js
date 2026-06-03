#!/usr/bin/env node
const http = require('http');
const port = process.env.PORT || 4016;
const host = process.env.HOST || '127.0.0.1';

const server = http.createServer((req, res) => {
  if (req.url === '/events' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'core-business', received: true, payload: body ? JSON.parse(body) : null }));
    });
  } else if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'core-business' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found', path: req.url, method: req.method }));
  }
});

server.listen(port, host, () => {
  console.log(`Core Business mock listening on http://${host}:${port}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
