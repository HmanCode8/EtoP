<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getMulterUploads } from '@/services/multerUpload'
import concurrentRequest from '@/untils/concurrentRequest'
import sparkMd5 from 'spark-md5'
import _ from 'lodash'
const uploadBox = ref(null)
const fileInput = ref(null)
const maxRequestNum = ref(2)
const folderInput = ref(null)
// const { chunks, createChunks } = useCutChunks();
const tableData = reactive([])
const showTableData = reactive({
  data: [],
})

const handletMulterUploads = async () => {
  const res = await getMulterUploads()
  showTableData.data = res.data
}
handletMulterUploads()

const CHUNK_SIZE = 1024 * 1024 * 10
const THREAD_COUNT = navigator.hardwareConcurrency || 4
const readerFile = async (file) => {
  // }
  const sparkMd5Hash = new sparkMd5()

  function webWOrkerChunks(file) {
    return new Promise((resolve) => {
      const chunkCount = Math.ceil(file.size / CHUNK_SIZE)
      const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT)
      let result = []
      let finnishCount = 0
      for (let i = 0; i < THREAD_COUNT; i++) {
        const worker = new Worker('../../../public/workers/fileWorker.js', { type: 'module' })
        const start = i * threadChunkCount
        const end = Math.min((i + 1) * threadChunkCount, chunkCount)
        worker.postMessage({ file, CHUNK_SIZE, startChunk: start, endChunk: end })
        worker.onmessage = (e) => {
         for (let j = start; j < end; j++) {
          result[j] = e.data[j-start]
          // worker.terminate()
          finnishCount++
          if (finnishCount === THREAD_COUNT) {
            resolve(result)
          }
         }
        }
      }
    })
  }

  function getHash(chunks) {
    console.log('chunks===', chunks)
    return new Promise((resolve) => {
      function _read(i) {
        if (i >= chunks.length) {
          resolve(sparkMd5Hash.end())
        }
        const blob = chunks[i]
        const reader = new FileReader()
        reader.onload = (e) => {
          sparkMd5Hash.append(e.target.result)
          _read(i + 1)
        }
        reader.readAsArrayBuffer(blob)
      }
      _read(0)
    })
  }
  return new Promise(async (resolve) => {
    const name = file.name
    const type = file.type
    const size = (file.size / 1024 / 1024).toFixed(2)
    const percentage = -1
    const chunks = await webWOrkerChunks(file)
    const hash = await getHash(chunks)
    console.log('hash===', hash)
    // const reader = new FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onload = (e) => {
    //   sparkMd5Hash.append(e.target.result);
    //   const hash = sparkMd5Hash.end();
    //   console.log("hash===", hash);
    //   const uploaded = _.some(showTableData.data, (item) => item.hash === hash)
    //   resolve({
    //     name,
    //     type,
    //     size,
    //     status: uploaded? "uploaded" : "pendding",
    //     percentage,
    //     file,
    //     hash,
    //   });
    // };
  })
}
const onFileChange = async (e) => {
  const files = e.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const data = await readerFile(file)
    tableData.push(data)
  }
}
// 点击上传
const handleUpload = async () => {
  try {
    const currentData = tableData.filter((item) => item.status === 'pendding')
    const res = await concurrentRequest(tableData, maxRequestNum.value, (index, e) => {
      tableData[index] = {
        ...tableData[index],
        percentage: Math.round((e.loaded / e.total) * 100),
      }
    })
    console.log('res===', res)
  } catch (error) {
    console.log(error)
  }
}

// 删除
const handleDelete = (row) => {
  const index = tableData.indexOf(row)
  tableData.splice(index, 1)
}

onMounted(() => {
  const uploadTarget = uploadBox.value
  //监听元素的拖拽

  uploadTarget.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.stopPropagation()
    uploadTarget.classList.add('dragover')
  })

  uploadTarget.addEventListener('dragleave', (e) => {
    e.preventDefault()
    e.stopPropagation()
    uploadTarget.classList.remove('dragover')
  })

  uploadTarget.addEventListener('drop', async (e) => {
    e.preventDefault()
    e.stopPropagation()
    uploadTarget.classList.remove('dragover')
    const items = e.dataTransfer.items

    function createChunks(file, chunkSize) {
      let chunks = []
      for (let i = 0; i < file.size; i += chunkSize) {
        const chunk = file.slice(i, i + chunkSize)
        chunks.push(chunk)
      }
      return chunks
    }
    for (const item of items) {
      const entry = item.webkitGetAsEntry()
      await getDeepEnters(entry)
    }
    function getDeepEnters(entry) {
      if (entry.isFile) {
        entry.file(async (file) => {
          const data = await readerFile(file)
          tableData.push(data)
        })
      } else {
        const reader = entry.createReader()
        reader.readEntries(async (entries) => {
          for (const entry of entries) {
            await getDeepEnters(entry)
          }
        })
      }
    }
  })
})

const fileSize = computed(() => tableData.reduce((acc, cur) => acc + Number(cur.size), 0))
const successNum = computed(() => tableData.filter((item) => item.percentage === 100).length)
</script>

<template>
  <div class="upload-box h-full w-full">
    <div ref="uploadBox" class="border hover:cursor-poiner flex flex-col justify-center items-center w-full h-60">
      <p>
        <el-icon><UploadFilled /></el-icon>
      </p>
      <p>将文件上传</p>
      <p>支持：jpg，png</p>
    </div>

    <div class="mt-5 text-sm w-full flex">
      <!-- 选择文件 -->
      <label for="fileInput" class="chosose-file bg-[#1a83fa] rounded-sm text-white p-1 hover:cursor-pointer shadow-lg hover:scale-105 duration-200"> 选择文件 </label>
      <input hidden type="file" id="fileInput" name="file" multiple ref="fileInput" @change="onFileChange" />

      <!-- 选择文件夹 -->
      <label for="folderInput" class="ml-4 chosose-folder bg-[#1a83fa] rounded-sm text-white p-1 hover:cursor-pointer shadow-lg hover:scale-105 duration-200"> 选择文件夹 </label>
      <input hidden type="file" id="folderInput" name="file" webkitdirectory multiple ref="folderInput" @change="onFileChange" />
    </div>
  </div>
</template>

<style scoped></style>
