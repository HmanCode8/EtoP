<script setup>
import { ref, reactive, onMounted, computed, watch, watchEffect, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import request from '@/untils/request' // 假设 request.ts 文件在当前目录下

import ReceivedEmail from '@/components/Email/ReceivedEmail.vue'
import SendEmail from '@/components/Email/SendEmail.vue'
import UserCenter from '@/components/Email/UserCenter.vue'
import Drafts from '@/components/Email/Drafts.vue'

const menuActive = ref('drafts')

const menus = reactive([
  { label: '个人中心', id: 'usercenter', icon: 'Edit' },
  { label: '发邮件', id: 'sendemail', icon: 'Avatar' },
  { label: '收邮件', id: 'resiemail', icon: 'Comment' },
  { label: '草稿箱', id: 'drafts', icon: 'Delete' },
])

const messages = ref([])
const users = ref([])
const router = useRouter()
const store = useStore()

const info = JSON.parse(localStorage.getItem('user'))
const userInfo = reactive(info || store.state.userInfo)
const handleBack = () => {
  // 使用 router.push() 方法跳转到指定路由
  router.push('/login')
  store.commit('setUserInfo', null)
}

/**
 * 获取邮件列表
 */
const getEmail = async () => {
  try {
    const res = await request.get('/api/email', { userid: userInfo._id })
    if (res.code === 200) {
      messages.value = res.data // 假设 messages 是一个 ref 或 reactive 对象
    }
  } catch (error) {
    console.error(error)
  }
}
/**
 * 获取用户列表
 */
const getUsers = async () => {
  try {
    const res = await request.get('/api/users')
    if (res.code === 200) {
      users.value = res.data // 假设 messages 是一个 ref 或 reactive 对象
    }
  } catch (error) {
    console.error(error)
  }
}

// 发送邮件
const sendEmail = async ({ content, contentBlock,recipientName, recipient, themContet }) => {
  try {
    // 构造发送邮件的数据
    const emailData = {
      senderName: userInfo.username,
      sender: userInfo._id,
      subject: themContet,
      recipient,
      recipientName,
      content,
      contentBlock,
    }

    const res = await request.post('/api/sendEmail', emailData)
    if (res.code === 200) {
      ElMessage({
        message: '发送成功',
        type: 'success',
      })
    }
  } catch (error) {
    console.error(error)
  }
}

//删除邮件
const deleteEmail = async (messageId) => {
  try {
    const res = await request.post('/api/deleteEmail', { messageId })
    if (res.code === 200) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      getEmail()
    }
  } catch (error) {
    console.error(error)
  }
}

const menuChange = (id) => {
  menuActive.value = id
}

watch(menuActive, (newVal) => {
  getEmail()
})
onMounted(() => {
  getUsers()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="header h-20 flex items-center pl-5 bg-cover bg-center">
      <div class="avatar flex justify-center items-center border w-10 h-10 bg-white rounded-full">
        <el-icon class="text-avatarColor"><UserFilled /></el-icon>
      </div>
      <div class="user-name text-white font-bold ml-5" v-if="userInfo">你好，{{ userInfo.username }}</div>
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
        <UserCenter v-if="menuActive === 'usercenter'" />
        <SendEmail :users="users" :menuActive="menuActive" @sendEmail="sendEmail" v-else-if="menuActive === 'sendemail'" />
        <ReceivedEmail :email="userInfo.email" :messages="messages" @deleteEmail="deleteEmail" v-else-if="menuActive === 'resiemail'" />
        <Drafts v-else />
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
