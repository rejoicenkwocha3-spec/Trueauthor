import test from 'node:test';
import assert from 'node:assert/strict';
import { analyse, stripReferences, stripQuotes, splitSentences } from '../src/lib/similarity.ts';

const A = 'Climate change is accelerating across the globe. Rising seas threaten coastal cities every single year. Researchers urge immediate policy action.';

test('no sources gives zero similarity and no invented matches', () => {
  const r = analyse(A, []);
  assert.equal(r.percent, 0); assert.equal(r.matches.length, 0); assert.equal(r.sourcesCompared, 0);
});
test('identical source is fully matched', () => {
  const r = analyse(A, [{ id: '1', title: 'Copy', content: A }]);
  assert.equal(r.percent, 100); assert.equal(r.matches.length, 3);
});
test('unrelated source does not match', () => {
  const r = analyse(A, [{ id: '2', title: 'Other', content: 'Bread requires flour water yeast and a warm kitchen to rise properly overnight.' }]);
  assert.equal(r.percent, 0);
});
test('partial copy is partially matched', () => {
  const r = analyse(A, [{ id: '3', title: 'Part', content: 'Rising seas threaten coastal cities every single year.' }]);
  assert.ok(r.percent > 0 && r.percent < 100);
  assert.equal(r.matches[0].sourceTitle, 'Part');
});
test('references can be excluded', () => {
  assert.equal(stripReferences('Body text.\nReferences\nSmith 2020.'), 'Body text.\n');
});
test('quotes can be excluded', () => {
  assert.ok(!stripQuotes('He said "this is a quoted passage" today').includes('quoted'));
});
test('sentence splitting', () => { assert.equal(splitSentences('One. Two! Three?').length, 3); });
