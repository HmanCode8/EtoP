<script setup>
import { ref, reactive, onMounted } from 'vue'
import { postMulterUploads } from '@/services/multerUpload'
import _ from 'lodash'
const uploadBox = ref(null)
const fileInput = ref(null)
const folderInput = ref(null)

const tata = []
const tableData = reactive(tata)

const readerFile = (file) => {
  return new Promise((resolve, reject) => {
    const result = []
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const data = e.target.result
      const name = file.name
      const type = file.type
      const size = (file.size / 1024 / 1024).toFixed(2) + 'M'
      const status = '待上传'
      const percentage = -1
      const action = '上传'
      resolve({ name, type, size, status, action, percentage, file, url: data })
    }
  })
}
// 点击上传
const onFileChange = async (e) => {
  const files = e.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const data = await readerFile(file)
    tableData.push(data)
  }
}
function concurrentRequest(tableData, maxNum = 3) {
  // const files = _.map(tableData, 'file')
  return new Promise((resolve) => {
    let index = 0 // 记录当前请求的索引
    let result = [] // 记录请求结果
    let count = 0 // 记录请求完成的数量
    async function _request() {
      let i = index // 记录之前的请求的索引
      const params = tableData[index] // 取出当前请求的文件
      index++ // 取出第一个后需要将索引+1
      try {
        const res = await xrhRequest(params)
        console.log('xrhRequest',res)
        result[i] = res
      } catch (error) {
        result[i] = error
      } finally {
        count++
        //首先这里肯定是某个请求完成了，无论成功与否，都要继续请求下一个，但是有边界，就是
        if (index < tableData.length) {
          _request()
        }
        // 整体的请求什么时候结束
        if (count === tableData.length) {
          resolve(result)
        }
      }
    }
    for (let i = 0; i < Math.min(maxNum, tableData.length); i++) {
      _request()
    }
  })
}

const xrhRequest = (params) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    // 添加要上传的文件数据
    formData.append('file', params.file) // fileInput 是文件输入框的引用
    xhr.upload.addEventListener('progress', function (e) {
      if (e.lengthComputable) {
        params.percentage = Math.round((e.loaded / e.total) * 100)
        // console.log('上传进度：' + percentage + '%')
      }
    })
    xhr.open('POST', 'http://localhost:3000/api/multerUploads', true)
    // 添加对 Content-Type 的设置
    xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    // 发送表单数据
    xhr.send(formData)
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve({...JSON.parse(xhr.responseText)})
      } else {
        reject(xhr.statusText)
      }
    }
  })
}

// 点击上传
const handleUpload = async () => {
  try {
    const res = await concurrentRequest(tableData)
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

    <div class="mt-5">
      <el-table :data="tableData" height="400" style="width: 100%">
        <!-- 居中 -->
        <el-table-column label="文件名" prop="name" />
        <el-table-column align="center" label="类型" prop="type" />
        <el-table-column align="center" label="大小" prop="size" />
        <el-table-column align="center" label="状态" prop="status">
          <template #default="scope">
            <el-progress v-if="scope.row.percentage !== -1" :percentage="50"></el-progress>
            <el-button v-else size="small" @click="handleEdit(scope.$index, scope.row)"> 待上传 </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-icon class="hover:text-red-500 hover:cursor-pointer" @click="handleDelete(scope.row)"><Delete /></el-icon>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex my-5 text-sm">
        <div class="p-1 mx-2">文件数量：{{ tableData.length }}</div>
        <div class="p-1 mx-2">已上传：{{ tableData.filter((item) => item.status === '已上传').length }}</div>
        <div class="p-1 mx-2">总大小：5.55M</div>
      </div>
      <div>
        <el-button type="primary" class="mt-5" @click="handleUpload"> 开始上传 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
