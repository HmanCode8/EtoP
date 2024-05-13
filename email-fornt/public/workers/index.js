import { ref } from 'vue'

const data = ref([])
//web worker
const worker = new Worker('./fileWorker.js', {
  type: 'module',
})
worker.postMessage({data: 'hello'})
worker.onmessage = (e) => {
  console.log(e.data)
}

export default worker