import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Konversi __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // untuk static file

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// URL Web App Google Apps Script kamu
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWel4BaNCO8D-8KsgNPFmtKIMgo0tScya1JCKfqeg6gyXYzZ_MYW5dNFVWPNWyQKWAtg/exec';

// Handle preflight CORS
app.options('/api', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Private-Network', 'true');
  res.status(204).send('');
});

// GET ke GAS
app.get('/api', async (req, res) => {
  try {
    const url = APPS_SCRIPT_URL + '?' + new URLSearchParams(req.query).toString();
    const response = await fetch(url);
    const data = await response.text();
    res.type('json').send(data);
  } catch (err) {
    console.error('GET Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST ke GAS
app.post('/api', async (req, res) => {
  try {
    console.log('Body diterima:', req.body); // Debug

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json(); // Ubah dari .text() ke .json()
    res.json(data);
  } catch (err) {
    console.error('POST Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
