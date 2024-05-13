// worker.js
import createChunks from '@/hooks/useChunks'

self.onmessage = async (e) => {
  const { file, CHUNK_SIZE, startChunk, endChunk } = e.data
  let proms = []
  for (let i = startChunk; i < endChunk; i++) {
   const p = createChunks(file, i,CHUNK_SIZE)
   proms.push(p)
  }
  const chucks =await Promise.all(proms)
  console.log('chucks==',chucks)
  self.postMessage(chucks)
}
