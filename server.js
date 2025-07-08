const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTMLファイルやCSS・JSなどを手動で返す（publicなし）
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/post.html', (req, res) => res.sendFile(path.join(__dirname, 'post.html')));
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css'))); // あれば

// 投稿データ保存先
const postsFile = 'posts.json';

// 投稿取得API
app.get('/posts', (req, res) => {
  if (!fs.existsSync(postsFile)) return res.json([]);
  const data = fs.readFileSync(postsFile, 'utf8');
  res.json(JSON.parse(data));
});

// 投稿受信API
app.post('/post', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).send('Missing data');

  const posts = fs.existsSync(postsFile) ? JSON.parse(fs.readFileSync(postsFile)) : [];
  posts.unshift({ name, message });

  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.redirect('/post.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
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
