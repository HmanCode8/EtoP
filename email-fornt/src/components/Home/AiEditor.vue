<script setup lang="ts">
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import { onMounted, onUnmounted, ref } from 'vue'
import { saveArticle, getArticleList, sendMessageToAi } from '@/services/article'
import _ from 'lodash'
import {  getUsers } from '@/services/emailService'

interface User {
  username: string
  userid: string
}

const divRef = ref()
let aiEditor: AiEditor | null = null
const title = ref('')
const userList = ref<User[]>([])
const editContent = ref('<strong>Hello</strong> <em>world</em>')
const isPreview = ref(false)

const getUsersList = async () => {
  try {
    const res = await getUsers()
    if (res.code === 200) {
      userList.value = _.map(res.data, (d) => d.username)
    }
  } catch (error) {
    console.error(error)
  }
}

getUsersList()
const getArticle = async () => {
  try {
    const res = await getArticleList()
    console.log(res)
    editContent.value = res.data[0].content
  } catch (error) {
    console.log(error)
  }
}
getArticle()
const save = async () => {
  const res = await saveArticle({
    title: title.value,
    content: editContent.value,
  })
  console.log(res)
  //   console.log("save", title.value, editContent.value);
}

const preview = () => {
  isPreview.value = !isPreview.value
}

const publish = () => {
  aiEditor?.setContent(editContent.value)
}

onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    placeholder: '点击输入内容...',
    content: '',
    theme: 'light',
    
    onMentionQuery: async (query: string) => {
      return _.filter(userList.value, (item: string) => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5) // 假设 messages 是一个 ref 或 reactive 对象username
    },
    onChange: (content: any) => {
      editContent.value = content.getHtml()
    },
    ai: {
      models: {
        spark: {
          appId: 'bb26f2f2',
          apiKey: '18cfb88ba62c8fa308569221f1e2de6f',
          apiSecret: 'ZGJkZWYxMGUyYjQ3YmE1Zjk2NWRlN2Rh',
          version: 'v3.5',
        },
        bubblePanelEnable: true,
        bubblePanelModel: 'spark',
        onCreateClientUrl: '....',
      },
    },
  })
})

onUnmounted(() => {
  aiEditor && aiEditor.destroy()
})
</script>

<template>
  <div class="header bg-white mb-2 p-2 flex justify-between items-center">
    <div class="title">
      <input class="text-2xl font-bold" type="text" v-model="title" placeholder="请输入标题" />
    </div>
    <div class="btn-group">
      <el-button class="btn btn-primary" @click="save">保存</el-button>
      <el-button class="btn btn-secondary" @click="preview">预览</el-button>
      <el-button class="btn btn-secondary" @click="publish">发布</el-button>
    </div>
  </div>
  <div v-show="!isPreview" class="shadow-lg rounded-sm" ref="divRef" style="height: 600px" />
  <div v-show="isPreview" class="preview-box p-2 bg-white rounded-sm " style="height: 600px; overflow: auto" v-html="editContent"></div>
</template>

<style scoped lang="scss">
input {
  transition: all 0.3s ease-in-out;
  &:focus {
    // color: #b8bec7;

    /* 在输入框获取焦点时应用的样式 */
    outline: transparent; /* 举例：添加蓝色的边框 */
  }
}
</style>
