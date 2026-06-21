require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const multer = require('multer');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const leaderboardRoutes = require('./routes/leaderboard');
const groupRoutes = require('./routes/groups');

// 👉 AJOUT : import des nouvelles routes
const fondsAideRoutes = require('./routes/fondsAide');
const banquesAideRoutes = require('./routes/banquesAide');

const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } });

const app = express();

// ⭐⭐⭐ AJOUT IMPORTANT : CORS (UNE SEULE FOIS) ⭐⭐⭐
const cors = require("cors");
app.use(cors());

// 🔌 Connexion à MongoDB
connectDB();

// 📦 Body parser
app.use(bodyParser.json({ limit: '6mb' }));

// 🛡️ Rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40
});
app.use('/api/', limiter);

// 🔐 Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/groups', groupRoutes);

// 👉 AJOUT : routes fonds d’aide + banques d’aide
app.use('/api/fonds-aide', fondsAideRoutes);
app.use('/api/banques-aide', banquesAideRoutes);

// 🧹 Nettoyage des réponses IA
function cleanAnthropicResponseText(txt) {
  return String(txt || '').replace(/```[\s\S]*?```/g, '').trim();
}

// 📄 Extraction texte PDF
async function extractTextFromPdfBuffer(buffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const doc = await loadingTask.promise;

    let full = '';

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const txt = await page.getTextContent();
      const pageText = txt.items.map(it => it.str).join(' ');

      full += '\n' + pageText;

      if (full.length > 30000) break;
    }

    return full;

  } catch (e) {
    console.error(e);
    return '';
  }
}

// 🤖 Proxy IA
app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, pdfBase64 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'missing prompt' });
    }

    const content = pdfBase64
      ? [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
          { type: 'text', text: prompt }
        ]
      : [{ type: 'text', text: prompt }];

    const key = process.env.ANTHROPIC_API_KEY;

    if (!key) {
      return res.status(500).json({ error: 'missing_anthropic_key' });
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1400,
        messages: [{ role: 'user', content }]
      })
    });

    const d = await r.json();

    if (d.error) {
      return res.status(502).json({ error: d.error.message || 'anthropic_error' });
    }

    const raw = (d.content && d.content[0] && d.content[0].text)
      ? d.content[0].text
      : JSON.stringify(d);

    const cleaned = cleanAnthropicResponseText(raw);

    let parsed = null;

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          parsed = JSON.parse(m[0]);
        } catch (e2) {
          parsed = { raw: cleaned };
        }
      } else {
        parsed = { raw: cleaned };
      }
    }

    return res.json({ ok: true, data: parsed });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// 📄 Upload PDF
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'no_file' });
    }

    const text = await extractTextFromPdfBuffer(req.file.buffer);

    return res.json({
      ok: true,
      text: text.slice(0, 20000)
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'pdf_error' });
  }
});

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`RevIT backend listening on ${PORT}`));
