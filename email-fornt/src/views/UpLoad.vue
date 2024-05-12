<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { getMulterUploads } from "@/services/multerUpload";
// import useCutChunks from "@/hooks/useChunks";
import concurrentRequest from "@/untils/concurrentRequest";
import sparkMd5 from "spark-md5";
import _ from "lodash";
const uploadBox = ref(null);
const fileInput = ref(null);
const maxRequestNum = ref(2);
const folderInput = ref(null);
// const { chunks, createChunks } = useCutChunks();
const tableData = reactive([]);
const showTableData = reactive({
  data: [],
});

const handletMulterUploads = async () => {
  const res = await getMulterUploads();
  showTableData.data = res.data;
};
handletMulterUploads();
const readerFile = (file) => {
  //web worker
  // const worker = new Worker("./worker", {
  //   type: "module",
  // });
  // worker.postMessage(file);
  // worker.onmessage = (e) => {
  //   console.log(e.data);
  // };

  return new Promise((resolve) => {
    const sparkMd5Hash = new sparkMd5.ArrayBuffer();
    const name = file.name;
    const type = file.type;
    const size = (file.size / 1024 / 1024).toFixed(2);
    const status = "待上传";
    const percentage = -1;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      sparkMd5Hash.append(e.target.result);
      resolve({
        name,
        type,
        size,
        status,
        percentage,
        file,
        hash: sparkMd5Hash.end(),
      });
    };
  });
};
// 点击上传
const onFileChange = async (e) => {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const data = await readerFile(file);
    tableData.push(data);
  }
};

// 点击上传
const handleUpload = async () => {
  try {
    const res = await concurrentRequest(
      tableData,
      maxRequestNum.value,
      (index, e) => {
        tableData[index] = {
          ...tableData[index],
          percentage: Math.round((e.loaded / e.total) * 100),
        };
      }
    );
    console.log("res===", res);
  } catch (error) {
    console.log(error);
  }
};

// 删除
const handleDelete = (row) => {
  const index = tableData.indexOf(row);
  tableData.splice(index, 1);
};

onMounted(() => {
  const uploadTarget = uploadBox.value;
  //监听元素的拖拽

  uploadTarget.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadTarget.classList.add("dragover");
  });

  uploadTarget.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadTarget.classList.remove("dragover");
  });

  uploadTarget.addEventListener("drop", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadTarget.classList.remove("dragover");
    const items = e.dataTransfer.items;

    function createChunks(file, chunkSize) {
      let chunks = [];
      for (let i = 0; i < file.size; i += chunkSize) {
        const chunk = file.slice(i, i + chunkSize);
        chunks.push(chunk);
      }
      return chunks;
    }
    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      await getDeepEnters(entry);
    }
    function getDeepEnters(entry) {
      if (entry.isFile) {
        entry.file(async (file) => {
          const data = await readerFile(file);
          tableData.push(data);
        });
      } else {
        const reader = entry.createReader();
        reader.readEntries(async (entries) => {
          for (const entry of entries) {
            await getDeepEnters(entry);
          }
        });
      }
    }
  });
});

const fileSize = computed(() =>
  tableData.reduce((acc, cur) => acc + Number(cur.size), 0)
);
const successNum = computed(
  () => tableData.filter((item) => item.percentage === 100).length
);
</script>

<template>
  <div class="upload-box h-full w-full">
    <div
      ref="uploadBox"
      class="border hover:cursor-poiner flex flex-col justify-center items-center w-full h-60"
    >
      <p>
        <el-icon><UploadFilled /></el-icon>
      </p>
      <p>将文件上传</p>
      <p>支持：jpg，png</p>
    </div>

    <div class="mt-5 text-sm w-full flex">
      <!-- 选择文件 -->
      <label
        for="fileInput"
        class="chosose-file bg-[#1a83fa] rounded-sm text-white p-1 hover:cursor-pointer shadow-lg hover:scale-105 duration-200"
      >
        选择文件
      </label>
      <input
        hidden
        type="file"
        id="fileInput"
        name="file"
        multiple
        ref="fileInput"
        @change="onFileChange"
      />

      <!-- 选择文件夹 -->
      <label
        for="folderInput"
        class="ml-4 chosose-folder bg-[#1a83fa] rounded-sm text-white p-1 hover:cursor-pointer shadow-lg hover:scale-105 duration-200"
      >
        选择文件夹
      </label>
      <input
        hidden
        type="file"
        id="folderInput"
        name="file"
        webkitdirectory
        multiple
        ref="folderInput"
        @change="onFileChange"
      />
    </div>

    <div class="mt-5">
      <div class="flex w-full justify-between">
        <div class="w-1/2">
          <el-table :data="tableData" height="400">
            <!-- 居中 -->
            <el-table-column label="文件名" prop="name" />
            <el-table-column align="center" label="类型" prop="type" />
            <el-table-column align="center" label="大小" prop="size" />
            <el-table-column align="center" label="状态" prop="status">
              <template #default="scope">
                <el-progress
                  v-if="scope.row.percentage !== -1"
                  :percentage="scope.row.percentage"
                ></el-progress>
                <el-button
                  v-else
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  待上传
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template #default="scope">
                <el-icon
                  class="hover:text-red-500 hover:cursor-pointer"
                  @click="handleDelete(scope.row)"
                  ><Delete
                /></el-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="border-l ml-10 border-gray-200 flex-grow">
          <el-table :data="showTableData.data" height="400">
            <!-- 居中 -->
            <el-table-column label="文件名" prop="fileName" />
            <el-table-column align="center" label="大小" prop="size" />
          </el-table>
        </div>
      </div>
      <div class="flex my-5 text-sm">
        <div class="p-1 mx-2">文件数量：{{ tableData.length }}</div>
        <div class="p-1 mx-2">已上传：{{ successNum }}</div>
        <div class="p-1 mx-2">总大小：{{ fileSize }}</div>
      </div>
      <div class="flex items-center w-full">
        <el-button type="primary" class="" @click="handleUpload">
          开始上传
        </el-button>
        <div class="ml-5">
          <span>并发请求数量：</span>
          <el-radio-group v-model="maxRequestNum">
            <el-radio :label="2">2</el-radio>
            <el-radio :label="3">3</el-radio>
            <el-radio :label="4">4</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
