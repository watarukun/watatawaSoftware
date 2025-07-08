const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルを配信
app.use(express.static(__dirname));

// GET / でpost.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'post.html'));
});

// POST /post の受信テスト
app.post('/post', (req, res) => {
  console.log('POST /post body:', req.body);
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
