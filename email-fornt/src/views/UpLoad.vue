<script setup>
import { ref, reactive, onMounted } from 'vue'

const uploadBox = ref(null)

const tata = [
  {
    name: '1.jpg',
    type: 'image/jpeg',
    size: '1.2M',
    status: '待上传',
    action: '上传',
  },
  {
    name: '2.jpg',
    type: 'image/jpeg',
    size: '1.2M',
    status: '待上传',
    action: '上传',
  },
  {
    name: '3.jpg',
    type: 'image/jpeg',
    size: '1.2M',
    status: '待上传',
    action: '上传',
  },
  {
    name: '4.jpg',
    type: 'image/jpeg',
    size: '1.2M',
    status: '待上传',
    action: '上传',
  },
  {
    name: '5.jpg',
    type: 'image/jpeg',
    size: '1.2M',
    status: '待上传',
    action: '上传',
  },
  {
    name: '6.jpg',
    type: 'image/jpeg',
    size: '1.2M',
    status: '待上传',
    action: '上传',
  },
]
const tableData = reactive(tata)
//监听uploadBox的文件拖入


onMounted(()=>{
  uploadBox.value.addEventListener('drop', (e) => {
  e.preventDefault()
  const files = e.dataTransfer.files   //获取文件列表

})

//监听uploadBox的文件选择
uploadBox.value.addEventListener('change', (e) => {
  const files = e.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const url = e.target.result
      const item = {
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2) + 'M',
        status: '待上传',
        action: '上传',
        url: url,
      }
      tableData.push(item)
    }
  }
})

function handleEdit(index, row) {
  console.log(index, row)
  row.status = '待上传'
  row.action = '上传'
}

function handleUpload() {
  console.log('handleUpload')
}
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
      <input hidden type="file" id="fileInput" name="file" multiple />

      <!-- 选择文件夹 -->
      <label for="folderInput" class="ml-4 chosose-folder bg-[#1a83fa] rounded-sm text-white p-1 hover:cursor-pointer shadow-lg hover:scale-105 duration-200"> 选择文件夹 </label>
      <input hidden type="file" id="folderInput" name="file" webkitdirectory multiple />
    </div>

    <div class="mt-5 w-full h-full">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="文件名" prop="name" />
        <el-table-column label="类型" prop="type" />
        <el-table-column label="大小" prop="size" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> 待上传 </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-icon><Delete /></el-icon>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex my-5 text-sm">
      <div class=" p-1 mx-2">文件数量：{{ tableData.length }}</div>
      <div class=" p-1 mx-2">已上传：{{ tableData.filter(item => item.status === '已上传').length }}</div>
      <div class=" p-1 mx-2">总大小：5.55M</div>
    </div>
    <div>
      <el-button type="primary" class="mt-5" @click="handleUpload"> 开始上传 </el-button>
    </div>
    </div>

    
  </div>
</template>

<style scoped></style>
