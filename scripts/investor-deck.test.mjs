import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/investor-deck.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const config = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const proof = JSON.parse(readFileSync(new URL('../reports/investor-deck-2026-assets.json', import.meta.url)));
const publicRoot = new URL('../public/', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

function dimensions(bytes) {
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  for (let at = 12; at < bytes.length;) {
    const type = bytes.toString('ascii', at, at + 4);
    const size = bytes.readUInt32LE(at + 4);
    if (type === 'VP8L') {
      assert.equal(bytes[at + 8], 0x2f);
      const packed = bytes.readUInt32LE(at + 9);
      return [1 + (packed & 0x3fff), 1 + ((packed >>> 14) & 0x3fff)];
    }
    at += 8 + size + (size % 2);
  }
  assert.fail('Expected a lossless WebP slide');
}

test('approved deck has exactly 15 ordered, versioned slides with useful alt text', () => {
  assert.equal(config.investorDeckSlideCount, 15);
  assert.equal(config.investorDeckSlides.length, 15);
  assert.deepEqual(config.investorDeckSlides.map(s => s.id), Array.from({ length: 15 }, (_, i) => i + 1));
  for (const slide of config.investorDeckSlides) {
    assert.ok(slide.src.includes(config.investorDeckRevision));
    assert.ok(slide.alt.includes(`slide ${slide.id} of 15:`));
    assert.match(slide.alt, /of 15: \S.+/);
  }
});

test('every slide matches its approved lossless PDF export at the original viewer dimensions', () => {
  for (const slide of config.investorDeckSlides) {
    const bytes = readFileSync(new URL(slide.src.slice(1), publicRoot));
    const reference = proof.assets.find(a => a.slide === slide.id);
    assert.deepEqual(dimensions(bytes), [2560, 1440]);
    assert.equal(sha(bytes), reference.sha256);
    assert.equal(reference.pixelIdenticalToPdfRaster, true);
    assert.equal(proof.contentParity.find(p => p.slide === slide.id).normalizedContentEqual, true);
  }
});

test('public PDF is byte-for-byte the approved source with a professional download name', () => {
  const bytes = readFileSync(new URL(config.investorDeckAssets.pdfSrc.slice(1), publicRoot));
  assert.equal(bytes.toString('ascii', 0, 5), '%PDF-');
  assert.equal(sha(bytes), 'c195ba3c4d6f0f60e74434fd9505b2b077661e9f6d83f3adb46453d33db40f61');
  assert.equal(config.investorDeckAssets.pdfDownloadName, 'TEMACORE_Investor_Deck_2026.pdf');
  assert.equal(proof.sourceSlideCount, 15);
});

test('production investor assets contain only the approved PDF and 15 slides', () => {
  const root = new URL('investor-deck/', publicRoot);
  const files = readdirSync(root, { recursive: true, withFileTypes: true }).filter(f => f.isFile());
  assert.equal(files.length, 16);
  assert.equal(files.filter(f => f.name.endsWith('.webp')).length, 15);
  assert.equal(files.filter(f => f.name.endsWith('.pdf')).length, 1);
  assert.ok(files.every(f => /^(slide-\d{2}\.webp|TEMACORE_Investor_Deck_2026\.pdf)$/.test(f.name)));
});
