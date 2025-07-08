const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const dataFile = '/tmp/messages.txt';

// POST /save
app.post('/save', (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.status(400).json({ status: 'error', message: 'No message' });

  try {
    fs.appendFileSync(dataFile, msg + '\n');
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to write' });
  }
});

// GET /messages（←これだけ残す）
app.get('/messages', (req, res) => {
  try {
    if (!fs.existsSync(dataFile)) return res.json([]);
    const lines = fs.readFileSync(dataFile, 'utf8')
      .split('\n')
      .filter(line => line.trim() !== '');
    res.json(lines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to read' });
  }
});

// 404対応
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// 起動
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
