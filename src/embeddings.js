import { pipeline } from '@xenova/transformers'

let extractor = null
async function getExtractor() {
  if (!extractor) extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  return extractor
}

export async function warmupEmbeddings() {
  await getExtractor()
}

const cache = new Map()
export async function embed(text) {
  if (cache.has(text)) return cache.get(text)
  const ext = await getExtractor()
  const out = await ext(text, { pooling: 'mean', normalize: true })
  const vec = Array.from(out.data)
  cache.set(text, vec)
  return vec
}
