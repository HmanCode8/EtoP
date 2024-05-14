import sparkMd5 from "spark-md5";
import MyWorker from "@/workers/fileWorker?worker";
const sparkMd5Hash = new sparkMd5.ArrayBuffer();
const CHUNK_SIZE = 1024 * 1024 * 10;
const THREAD_COUNT = navigator.hardwareConcurrency || 4;

function createChunks(file, index, chunkSize) {
  return new Promise((resolve) => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    const reader = new FileReader();
    const blob = file.slice(start, end);
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      resolve({
        index,
        start,
        end,
        blob,
      });
    };
  });
}

function webWOrkerChunks(file) {
  return new Promise((resolve) => {
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE); //总共分成多少块  10
    const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT); //每个线程分成多少块2  1  0-2  2 2-4  4 4-6  6 6-8  8
    let result = [];
    let finnishCount = 0;
    for (let i = 0; i < THREAD_COUNT; i++) {
      const worker = new MyWorker({
        type: "module",
      });
      const start = i * threadChunkCount;
      const end = Math.min((i + 1) * threadChunkCount, chunkCount);
      worker.postMessage({
        file,
        CHUNK_SIZE,
        startChunk: start,
        endChunk: end,
      });
      worker.onmessage = (e) => {
        for (let j = start; j < end; j++) {
          result[j] = e.data[j - start];
        }
        worker.terminate();
        finnishCount++;
        if (finnishCount === THREAD_COUNT) {
          resolve(result);
        }
      };
    }
  });
}

function getHash(chunks) {
  return new Promise((resolve) => {
    function _read(i) {
      if (i >= chunks.length) {
        resolve(sparkMd5Hash.end());
      }
      const blob = chunks[i]?.blob || chunks[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        sparkMd5Hash.append(e.target.result);
        _read(i + 1);
      };
      reader.readAsArrayBuffer(blob);
    }
    _read(0);
  });
}
export { createChunks, webWOrkerChunks, getHash };
