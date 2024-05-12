import { ref } from "vue";
import sparkMd5 from "spark-md5";

const toChunk = (file, index, chunkSize) => {
  return new Promise((resolve, reject) => {
    const spark = new sparkMd5.ArrayBuffer();
    const start = index * chunkSize;
    const end = (index + 1) * chunkSize;
    const reader = new FileReader();
    const blob = file.slice(start, end);
    reader.onload = (e) => {
      const chunk = e.target.result;
      spark.append(chunk);
      const res = {
        start,
        end,
        index,
        blob,
        hash: spark.end(),
      };
      resolve(res);
    };
    reader.readAsArrayBuffer(blob);
  });
};

const CHUNK_SIZE = 1024 * 1024 * 5; // 1MB
const useCutChunks = (file) => {
  const chunks = ref([]);
  const chunkCount = ref(0);

  async function createChunks(file) {
    const count = Math.ceil(file.size / CHUNK_SIZE);
    console.log(count);
    for (let i = 0; i < count; i++) {
      const chunk = await toChunk(file, i, CHUNK_SIZE);
      chunks.value.push(chunk);
    }
  }

  return { chunks, createChunks };
};

export default useCutChunks;
