/**
 * server.js - Server HTTP locale per GiGa Labor
 * Avvia con: node server.js
 * Richiede Node.js (nessun npm install necessario)
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css; charset=utf-8',
  '.js'   : 'application/javascript; charset=utf-8',
  '.json' : 'application/json; charset=utf-8',
  '.svg'  : 'image/svg+xml',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.webp' : 'image/webp',
  '.ico'  : 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff' : 'font/woff',
  '.ttf'  : 'font/ttf',
  '.txt'  : 'text/plain; charset=utf-8',
  '.xml'  : 'application/xml; charset=utf-8',
};

const server = http.createServer(function(req, res) {
  var urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  var filePath = path.join(ROOT, urlPath);
  var ext      = path.extname(filePath).toLowerCase();
  var mime     = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - File non trovato: ' + urlPath);
      return;
    }
    res.writeHead(200, {
      'Content-Type' : mime,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', function() {
  var url = 'http://localhost:' + PORT;
  console.log('');
  console.log('  =========================================');
  console.log('   GiGa Labor - Server locale attivo');
  console.log('   ' + url);
  console.log('   Premi Ctrl+C per fermare');
  console.log('  =========================================');
  console.log('');

  var opener =
    process.platform === 'win32'  ? 'start ' + url :
    process.platform === 'darwin' ? 'open ' + url  :
    'xdg-open ' + url;
  exec(opener);
});
