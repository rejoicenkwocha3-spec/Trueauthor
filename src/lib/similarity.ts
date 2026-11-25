// Genuine n-gram similarity engine. Compares a submission only against sources it is
// given (the user's own authorised documents). It never invents sources.

export type SimilarityOptions = { excludeQuotes: boolean; excludeReferences: boolean; ngram: number };
export type Source = { id: string; title: string; content: string };
export type Match = { sentence: string; sourceId: string; sourceTitle: string; overlap: number };
export type SimilarityResult = { percent: number; matches: Match[]; sourcesCompared: number; wordsAnalysed: number };

export const DEFAULT_OPTIONS: SimilarityOptions = { excludeQuotes: false, excludeReferences: true, ngram: 5 };

export function stripReferences(text: string): string {
  const m = /^\s*(references|bibliography|works cited|reference list)\s*:?\s*$/im.exec(text);
  return m ? text.slice(0, m.index) : text;
}

export function stripQuotes(text: string): string {
  return text.replace(/"[^"\n]{3,}"|“[^”\n]{3,}”/g, ' ');
}

export function normalise(text: string): string {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function splitSentences(text: string): string[] {
  return text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/).map((s) => s.trim()).filter((s) => s.length > 0);
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function shingles(words: string[], n: number): Set<string> {
  const out = new Set<string>();
  if (words.length < n) return out;
  for (let i = 0; i <= words.length - n; i++) out.add(words.slice(i, i + n).join(' '));
  return out;
}

export function analyse(submission: string, sources: Source[], opts: Partial<SimilarityOptions> = {}): SimilarityResult {
  const o = { ...DEFAULT_OPTIONS, ...opts };
  let text = submission;
  if (o.excludeReferences) text = stripReferences(text);
  if (o.excludeQuotes) text = stripQuotes(text);

  const sentences = splitSentences(text);
  const totalWords = sentences.reduce((n, s) => n + wordCount(s), 0);
  const sourceShingles = sources.map((s) => ({ s, set: shingles(normalise(stripReferences(s.content)).split(' ').filter(Boolean), o.ngram) }));

  const matches: Match[] = [];
  let matchedWords = 0;
  for (const sentence of sentences) {
    const words = normalise(sentence).split(' ').filter(Boolean);
    const sh = shingles(words, o.ngram);
    if (sh.size === 0) continue; // too short to compare fairly
    let best: { id: string; title: string; overlap: number } | null = null;
    for (const { s, set } of sourceShingles) {
      let hit = 0;
      sh.forEach((g) => { if (set.has(g)) hit++; });
      const overlap = hit / sh.size;
      if (overlap >= 0.5 && (!best || overlap > best.overlap)) best = { id: s.id, title: s.title, overlap };
    }
    if (best) {
      matches.push({ sentence, sourceId: best.id, sourceTitle: best.title, overlap: Math.round(best.overlap * 100) / 100 });
      matchedWords += wordCount(sentence);
    }
  }
  const percent = totalWords === 0 ? 0 : Math.round((matchedWords / totalWords) * 1000) / 10;
  return { percent, matches, sourcesCompared: sources.length, wordsAnalysed: totalWords };
}
