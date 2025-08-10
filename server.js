// server.js
import express from 'express';
import { loadCSV, getById, getByExactWord, getByNormalized } from './words.js';

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  // Load CSV into memory before accepting requests
  await loadCSV();

  // Get by numeric id -> single object or 404
  app.get('/api/id/:id', (req, res) => {
    const item = getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });

  // Try to fetch by exact word first, fallback to normalized
  app.get('/api/word/:word', (req, res) => {
    // Express decodes URL-encoded params so 'abi%C3%A1s' => 'abiás'
    const raw = req.params.word;

    // 1) exact (accent-preserving) or case-insensitive exact
    const exact = getByExactWord(raw);
    if (exact && exact.length) {
      // If multiple exact variants exist (e.g., two entries spelled same), return array
      return res.json(exact.length === 1 ? exact[0] : exact);
    }

    // 2) normalized fallback (accent stripped) — could return multiple matches
    const normalized = getByNormalized(raw);
    if (normalized && normalized.length) {
      return res.json(normalized);
    }

    return res.status(404).json({ error: 'Not found' });
  });

  // A dedicated normalized search endpoint (always returns array)
  app.get('/api/search/:query', (req, res) => {
    const results = getByNormalized(req.params.query);
    res.json(results); // [] if none
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
})();
