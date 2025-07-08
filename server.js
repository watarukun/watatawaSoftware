const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 静的ファイルはルートディレクトリで配信
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const postsFile = path.join(__dirname, 'posts.json');

app.get('/posts', (req, res) => {
  if (!fs.existsSync(postsFile)) return res.json([]);
  const data = fs.readFileSync(postsFile, 'utf8');
  res.json(JSON.parse(data));
});

app.post('/post', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Missing data' });

  const posts = fs.existsSync(postsFile) ? JSON.parse(fs.readFileSync(postsFile)) : [];
  posts.unshift({ name, message, date: new Date().toISOString() });

  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// 404対応（静的ファイル以外）
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
