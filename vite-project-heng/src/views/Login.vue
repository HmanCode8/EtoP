<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import request from '@/untils/request';
// import type { FormProps } from 'element-plus'

const labelPosition = ref('right')
const router = useRouter()
const store = useStore()


const form = reactive({
  username: 'shiheng he',
  email: '11@email.com',
  password: '123',
})

const register = async () => {
  const res = await request.post('/api/register', {
    username: form.username,
    email: form.email,
    password: form.password
  })
}
const login = async () => {
  const res = await request.post('/api/login', {
    username: form.username,
    email: form.email,
    password: form.password
  })
  if(res.code === 200){
    store.commit('setUserInfo', res.data.existingUser)
    localStorage.setItem('user', JSON.stringify(res.data.existingUser))
    router.push('/email')
  }else{
  console.log('login',res)
  }
  console.log('login',res);
}
</script>

<template>
  <div class="h-screen bg-[#ecf0f3] flex items-center justify-center">
    <div class="login-modal w-1/2 h-1/2 border bg-[#ecf0f3] flex shadow-inner overflow-hidden">
      <div class="m-l relative w-1/3 border-r-4 flex flex-col items-center justify-center">
        <div class="inner-t"></div>
        <div class="inner-b"></div>
        <div class="l-title">
          <div class="font-bold text-center text-xl">welcome back!</div>
          <div class="text-sm text-[#c2c6c9]">你有账号的话，直接就登录吧，不要麻烦就行！！</div>
        </div>
        <div class="l-btn text-white w-full flex justify-center m-10">
          <el-button class="bg-[#4971e3] shadow-inner rounded-3xl text-sm w-1/2 h-10 text-white" type="'primary'" @click="login">SING IN</el-button>
        </div>
      </div>
      <div class="m-r w-2/3 flex flex-col justify-center items-center">
        <div class="font-bold text-center text-xl">创建账号</div>
        <div class="text-sm text-[#c2c6c9] p-3">注册账号标识同意协议说明</div>
        <div class="icons"></div>
        <div class="forms w-2/3 p-3">
          <el-form :label-position="labelPosition" label-width="auto" :model="form">
            <el-form-item>
              <el-input class="custom-input" placeholder="Name" v-model="form.username" />
            </el-form-item>
            <el-form-item>
              <el-input class="custom-input" placeholder="Email" v-model="form.email" />
            </el-form-item>
            <el-form-item>
              <el-input class="custom-input" placeholder="Password" v-model="form.password" />
            </el-form-item>
          </el-form>
        </div>
        <div class="l-btn text-white w-full flex justify-center m-10">
          <el-button class="bg-[#4971e3] shadow-inner rounded-3xl text-sm w-1/2 h-10 text-white" type="'primary'" @click="register">SING UP</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-modal {
  box-shadow: 2px 2px 6px #fff, -2px -2px 6px #f9f9f9;
}
button {
  box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
}
.m-l {
  position: relative;
}
.inner-t {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ecf0f3;
  box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
  top: -36%;
  right: -11px;
  transition: 1.25s;
}
.inner-b {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ecf0f3;
  box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
  bottom: -15%;
  left: -18px;
  transition: 1.25s;
}
</style>
