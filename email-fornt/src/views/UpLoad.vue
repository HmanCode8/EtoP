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
      const action = '上传'
      resolve({ name, type, size, status, action, file,url: data })
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

// 点击上传
const handleUpload = async () => {
  debugger
try {
    const res = await postMulterUploads({files: _.map(tableData,'file')})
    console.log('res',res)
  // const res = await postMulterUploads(tableData)
} catch (error) {
  
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

  uploadTarget.addEventListener('drop', async(e) => {
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
  <div class="upload-box  h-full w-full">
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
      <el-table :data="tableData" height="400"   style="width: 100%">
        <!-- 居中 -->
        <el-table-column label="文件名" prop="name" />
        <el-table-column align="center" label="类型" prop="type" />
        <el-table-column align="center" label="大小" prop="size" />
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <el-progress :percentage="50"></el-progress>
            <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> 待上传 </el-button> -->
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
