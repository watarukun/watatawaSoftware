const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname,  req.url === '/' ? 'index.html' : req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // ファイルが存在しない → 404.html を返す
      fs.readFile(path.join(__dirname,  '404.html'), (err404, data404) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(data404 || '404 Not Found');
      });
    } else {
      // ファイルが存在する → 通常表示
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
