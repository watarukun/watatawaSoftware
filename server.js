const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Supabase設定
const supabaseUrl = 'https://ftuamjkicezhtxfyujob.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dWFtamtpY2V6aHR4Znl1am9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODk0NDcsImV4cCI6MjA2NzU2NTQ0N30.fu_4lkKnjeAeJTUGwc6KTVCrN2mqberTuGfLOwaWSeA';

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// メッセージ一覧取得
app.get('/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// メッセージ保存
app.post('/save', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const { data, error } = await supabase
    .from('messages')
    .insert([{ text: message }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ status: 'ok' });
});

// 404対応 - 静的ファイル以外のルート
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
