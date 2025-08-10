// words.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// Helpers and in-memory maps
const __dirname = path.resolve();
const byId = new Map();         // id -> single entry
const byExact = new Map();      // exact (NFC) word -> [entries]
const byExactCI = new Map();    // exact case-insensitive -> [entries]
const bySearch = new Map();     // normalized (diacritics removed, lowercase) -> [entries]

// remove accents/diacritics for normalized searches
export function stripDiacritics(s) {
  // Normalize to NFD (decomposed), then strip combining marks
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// load CSV and populate maps
export function loadCSV(csvFile = path.join(__dirname, 'data', 'talabaldugan.csv')) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFile, 'utf8')       // ensure UTF-8 read
      .pipe(csv())
      .on('data', (row) => {
        // Create a consistent entry object
        const entry = {
          id: Number(row.id),                  // parse id to number
          word: String(row.word),
          definition: String(row.definition || ''),
          audio: String(row.audio || '')
        };

        // 1) byId map (one entry per id)
        byId.set(entry.id, entry);

        // 2) exact match map (preserve accents using NFC)
        const exactKey = entry.word.normalize('NFC'); // composed form
        if (!byExact.has(exactKey)) byExact.set(exactKey, []);
        byExact.get(exactKey).push(entry);

        // 3) case-insensitive exact map
        const exactCiKey = exactKey.toLowerCase();
        if (!byExactCI.has(exactCiKey)) byExactCI.set(exactCiKey, []);
        byExactCI.get(exactCiKey).push(entry);

        // 4) normalized search key (strip diacritics + lowercase)
        const searchKey = stripDiacritics(entry.word).toLowerCase();
        if (!bySearch.has(searchKey)) bySearch.set(searchKey, []);
        bySearch.get(searchKey).push(entry);
      })
      .on('end', () => {
        console.log(`✅ Loaded ${byId.size} rows from CSV`);
        resolve();
      })
      .on('error', reject);
  });
}

// lookup helpers
export function getById(id) {
  return byId.get(Number(id)) || null;
}

export function getByIdRange(n) {
  if (isNaN(n) || n < 1) return [];
  const results = [];
  for (let i = 1; i <= n; i++) {
    const entry = byId.get(i);
    if (entry) results.push(entry);
  }
  return results;
}

export function getByExactWord(word) {
  if (!word) return null;
  const keyNfc = word.normalize('NFC');
  if (byExact.has(keyNfc)) return byExact.get(keyNfc);         // exact (preserving accents)
  const keyCi = keyNfc.toLowerCase();
  if (byExactCI.has(keyCi)) return byExactCI.get(keyCi);       // case-insensitive
  return null;
}

export function getByFirstLetter(letter) {
  if (!letter || letter.length !== 1) return [];
  const normLetter = stripDiacritics(letter).toLowerCase();
  const results = [];
  for (const entry of byId.values()) {
    const firstChar = stripDiacritics(entry.word.charAt(0)).toLowerCase();
    if (firstChar === normLetter) results.push(entry);
  }
  return results;
}

export function getByNormalized(word) {
  if (!word) return [];
  const key = stripDiacritics(word).toLowerCase();
  return bySearch.get(key) || [];
}
