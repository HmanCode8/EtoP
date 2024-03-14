<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import moment from 'moment'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import request from '@/untils/request' // 假设 request.ts 文件在当前目录下

import ReceivedEmail from '@/components/Email/ReceivedEmail.vue'

import Quill from 'quill'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'quill/dist/quill.snow.css'

const menuActive = ref(1)
const editorContainer = ref('')
let editor
let highlightedCode = ref('')
const menus = reactive([
  { label: '写邮件', id: 1, icon: 'Edit' },
  { label: '发邮件', id: 2, icon: 'Avatar' },
  { label: '收邮件', id: 3, icon: 'Comment' },
  { label: '草稿箱', id: 4, icon: 'Delete' },
])

const messages = ref([])
const fontSize = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72])
const router = useRouter()

const handleBack = () => {
  // 使用 router.push() 方法跳转到指定路由
  router.push('home')
}

/**
 * 获取邮件列表
 */
const getEmail = async () => {
  try {
    const data = await request.get('/email', { showLoading: true })
    console.log(data)
    // 假设 messages 是一个 ref 或 reactive 对象
    messages.value = data // 假设 messages 是一个 ref 或 reactive 对象
  } catch (error) {
    console.error(error)
  }
}

const menuChange = (id) => {
  menuActive.value = id
}

const editRoot = () => {
  editor = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [...fontSize, true] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }, { align: ['center'] }, { align: ['right'] }, { align: ['justify'] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote'],
        ['link'],
        ['image'],
        ['code-block'],
        [{ table: 'table' }],
        ['undo', 'redo'],
        ['clean'],
      ],
    },
  })

  editor.on('text-change', () => {
    console.log('editor', editor.root.innerHTML)
    code.value = editor.root.innerHTML
    highlightCode()
  })
}

onMounted(() => {
  editRoot()
  getEmail()
})

function highlightCode() {
  const highlighted = hljs.highlightAuto(code.value).value
  highlightedCode.value = highlighted
}
</script>


<template>
  <!-- <el-row>
    <el-col :span="12">
      <div class="box w-2/3 border shadow-slate-700 flex flex-col drop-shadow-md justify-center align-sub m-10">
        <div ref="editorContainer" class="" style="height: 400px"></div>
      </div>
    </el-col>

    <el-col :span="12"> <el-button type="primary">Primary</el-button></el-col>
  </el-row> -->
  <div class="h-screen flex flex-col">
    <div class="header h-20 flex items-center pl-5 bg-cover bg-center">
      <div class="avatar flex justify-center items-center border w-10 h-10 bg-white rounded-full">
        <el-icon class="text-avatarColor"><UserFilled /></el-icon>
      </div>
      <div class="user-name text-white font-bold ml-5">你好，shiheng he</div>
      <div class="back flex items-center text-white absolute right-5 hover:cursor-pointer hover:text-menuTextColor">
        <span>返回</span>
        <el-icon class="text-lg" @click="handleBack"> <Right /></el-icon>
      </div>
    </div>
    <div class="contain bg-myBgColor flex flex-1 rounded-md">
      <div class="w-40 m-3 bg-white rounded-sm">
        <!-- 侧边菜单栏 -->
        <div class="flex flex-col h-full">
          <div class="menu-title font-bold p-5 bg-[#1c67d7] text-[#dd5050]">我的站内信</div>
          <ul>
            <li v-for="m in menus" :key="m.id" @click="menuChange(m.id)" :class="`p-2 hover:cursor-pointer hover:text-fontColor shadow-sm ${menuActive === m.id ? 'bg-menuBg text-fontColor' : ''}`">
              <div class="flex items-center">
                <el-icon class="text-menuTextColor"><component :is="m.icon" /></el-icon>
                <div class="ml-4">{{ m.label }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="calc-h flex-1 ml-0 m-3 bg-white flex">
        <ReceivedEmail :messages="messages" />
        <div class="content-user-input flex flex-col h-3/4 p-5 lg:w-3/4">
          <div ref="editorContainer" class="h-5/6"></div>
          <div class="flex justify-end">
            <el-button class="bg-[#0a57c3] mt-5 w-1/6" type="primary" @click="() => {}">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.box {
  margin: 10px auto;
}
.header {
  background-image: url('../assets/title-bg.png');
}
.calc-h {
  height: calc(100vh - 100px);
}
</style>
