<script setup>
import { ref, reactive, onMounted, computed, watch,inject } from 'vue'
import concurrentRequest from '@/untils/concurrentRequest'
import { webWOrkerChunks, getHash } from '@/hooks/useChunks'
import { bigFileUpload, mergeBigFile, getMulterUploads } from '@/services/bigFileUpload'
import xhrRequest from '@/untils/xhrRequest'
import _ from 'lodash'
import { ElMessage } from 'element-plus'

//2G的上传限制
const MAX_SIZE = 2 * 1024 * 1024 * 1024 // 2G 
const gsap = inject('gsap')
const uploadBox = ref(null)
const tableRef = ref(null)
const fileInput = ref(null)
const maxRequestNum = ref(6)
const folderInput = ref(null)
const uploadStatus = ref('')
const tableData = reactive([])
const showTableData = reactive({
  data: [],
})

// 4种文件状态，未上传，上传中，已上传['pendding', 'uploading', 'uploaded', 'failed']
const statusMap = ['pendding', 'uploading', 'uploaded', 'failed']
const mapAction = {
  pendding: '未上传',
  uploading: '上传中',
  uploaded: '已上传',
  failed: '上传失败',
}
const btnType = {
  pendding: '',
  uploading: 'primary',
  uploaded: 'success',
  failed: 'danger',
}

const handletMulterUploads = async () => {
  const res = await getMulterUploads()
  showTableData.data = res.data
}
handletMulterUploads()

const readerFile = async (file) => {
  const name = file.name || file.path.split('\\').pop()
  const type = file.type || file.name.split('.').pop()
  const size = (file.size / 1024 / 1024).toFixed(2)
  const chunks = await webWOrkerChunks(file)
  const hash = await getHash(chunks)
  const uploaded = _.some(showTableData.data, (item) => item.hash === hash) //服务器上是否已经有
  const isHave = _.some(tableData, (item) => item.hash === hash) //前端 界面上是否已经有
  // 如果文件已经上传过，则不再上传
  if (isHave) {
    //ElMessage.warning('文件已上传过')
    return
  }
  tableData.push({
    name,
    type,
    size,
    status: uploaded ? statusMap[2] : statusMap[0],
    percentage: 0,
    file,
    hash,
    chunks,
  })
}
const onFileChange = (e) => {
  const files = e.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    readerFile(file)
  }
}
// 点击上传
const bigUpload = ({ chunks, file }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 分块上传
      const update = (index, e, param) => {
        const percentage = Math.round((e.loaded / e.total) * 100)
      }
      // const chunks = await webWOrkerChunks(file)
      const res = await concurrentRequest({
        url: '/api/bigFileUpload',
        requestSize: chunks,
        maxNum: maxRequestNum.value,
        fileName: file.name,
        type: 'bigUpload',
        callback: update,
      })
      console.log('mergeRes', res)
      if (_.every(res, (item) => item.code === 200)) {
        const mergeRes = await mergeBigFile({ fileName: file.name })
        if (mergeRes.code === 200) {
          resolve(mergeRes)
        } else {
          reject(mergeRes)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

//列表删除
const handleUpload = async () => {
  try {
    const peddingData = _.filter(tableData, { status: 'pendding' })
    if (peddingData.length === 0) {
      return alert('没有待上传文件')
    }
    const update = (index, e, param) => {
      const percentage = Math.round((e.loaded / e.total) * 100)
      const k = tableData.findIndex((item) => item.hash === param.hash)
      tableData[k] = {
        ...tableData[k],
        percentage,
        status: percentage < 100 ? statusMap[1] : statusMap[2],
      }
    }
    const res = await concurrentRequest({
      url: '/api/multerUploads',
      requestSize: peddingData,
      maxNum: maxRequestNum.value,
      callback: update,
    })
    if (_.every(res, (item) => item.code === 200)) {
      ElMessage.success('上传成功' + res.length + '个文件')
    }
    console.log('res===', res)
    const hashs = _.map(res, (r) => r.data.hash)
    // 上传成功后更新状态
    tableData.forEach((item) => {
      item.status = item.status === statusMap[2] ? statusMap[2] : _.includes(hashs, item.hash) ? statusMap[2] : statusMap[3]
    })
  } catch (error) {
    console.log(error)
  }
}

//单行上传
const handleUploadSigeFile = async (row) => {
  console.log('handleUploadSigeFile', row)
  bigUpload(row)
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
    for (const item of items) {
      const entry = item.webkitGetAsEntry()
      await getDeepEnters(entry)
    }
    function getDeepEnters(entry) {
      if (entry.isFile) {
        entry.file((file) => readerFile(file))
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

onMounted(() => {
  gsap.fromTo(uploadBox.value, { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 3, ease: 'elastic' })
  gsap.fromTo(tableRef.value, { opacity: 0, y: 200 }, { opacity: 1, y: 0, duration: 3, ease: 'elastic' })
})
const fileSize = computed(() => tableData.reduce((acc, cur) => acc + Number(cur.size), 0).toFixed(2))
const successNum = computed(() => tableData.filter((item) => item.percentage === 100).length)
</script>

<template>
  <div class="upload-box h-full w-full">
    <div ref="uploadBox" class="rounded-xl bg-slate-500 shadow-lg hover:cursor-poiner flex flex-col justify-center items-center w-full h-60">
      <p>
        <el-icon><UploadFilled /></el-icon>
      </p>
      <p>将文件拖拽到此处，或点击选择文件</p>
      <p>目前支持任何文件类型，单文件测试通过3G，多文件测试通过10G</p>
    </div>

    <div class="mt-5 text-sm w-full flex">
      <!-- 选择文件 -->
      <label for="fileInput" class="chosose-file bg-[#1a83fa] rounded-sm text-white p-1 hover:cursor-pointer shadow-lg hover:scale-105 duration-200"> 选择文件 </label>
      <input hidden type="file" id="fileInput" name="file" multiple ref="fileInput" @change="onFileChange" />

      <!-- 选择文件夹 -->
      <label for="folderInput" class="ml-4 chosose-folder bg-[#1a83fa] rounded-sm text-white p-1 hover:cursor-pointer shadow-lg hover:scale-105 duration-200"> 选择文件夹 </label>
      <input hidden type="file" id="folderInput" name="file" webkitdirectory multiple ref="folderInput" @change="onFileChange" />
    </div>

    <div class="mt-5">
     <div ref="tableRef">
      <el-table  class="rounded-xl shadow-lg hover:cursor-poiner" :data="tableData" height="400">
        <!-- 居中,超出隐藏 -->
        <el-table-column label="文件名" show-overflow-tooltip show prop="name" />
        <el-table-column align="center" show-overflow-tooltip label="类型" prop="type" />
        <el-table-column align="center" label="大小/M" prop="size" />
        <el-table-column align="left" label="状态" prop="status">
          <template #default="scope">
            <el-progress v-if="scope.row.status === statusMap[1]" :percentage="scope.row.percentage"></el-progress>
            <el-button v-else size="small" :type="btnType[scope.row.status]">
              {{ mapAction[scope.row.status] }}
            </el-button>
            <!-- <span v-if="Number(scope.row.size) > MAX_SIZE">推荐单个上传</span> -->
            <el-popover v-if="Number(scope.row.file.size) > MAX_SIZE" placement="top-start" title="提示" :width="200" trigger="hover" content=" 文件大小超过2G，推荐单个上传 ">
              <template #reference>
                <!-- <el-button @click="handleUploadSigeFile(scope.row)"  size="small" :type="btnType[scope.row.status]"></el-button> -->
                <el-icon @click="handleUploadSigeFile(scope.row)"><ChatDotRound /></el-icon>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-icon class="hover:text-red-500 hover:cursor-pointer" @click="handleDelete(scope.row)"><Delete /></el-icon>
          </template>
        </el-table-column>
      </el-table>
     </div>
      <div class="flex my-5 text-sm">
        <!-- <div class="p-1 mx-2">文件数量：{{ tableData.length }}个</div> -->
        <div class="p-1 mx-2">已上传：{{ successNum }} / {{ tableData.length }} 个</div>
        <div class="p-1 mx-2">总大小：{{ fileSize }}M</div>
      </div>
      <div class="flex items-center w-full">
        <el-button type="primary" class="" @click="handleUpload"> 开始上传 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
