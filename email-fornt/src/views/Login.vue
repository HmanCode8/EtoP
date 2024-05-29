<script setup>
import { ref, reactive, onMounted, watchEffect, inject, watch } from 'vue'
import CryptoJS from 'crypto-js'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { register, captcha, sendSmsCode, addPhone, login } from '@/services/userService'
import { getRandomLoginImg } from '@/services/wallpaperService'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import defaultBgImg from '@/assets/images/sky.jpeg'
import { useUserStore } from '@/store'

const tabs = [
  {
    label: '账号密码登录',
    value: 'account',
  },
  {
    label: '验证码登录',
    value: 'captcha',
  },
]
const ROUND_LOGIN_IMG = 'https://api.vvhan.com/api/wallpaper/views?type=json'
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/

const username = import.meta.env.VITE_LOGIN_USER ?? ''
const password = import.meta.env.VITE_LOGIN_PASSWORD ?? ''
const loginUserId = ref('')
const gsap = inject('gsap')
const loginBG = ref(null)
const loginTabs = ref(tabs)
const activeTab = ref(tabs[0].value)
const svgCode = ref('')
const loginTipBG = ref(null)
const mingyan = ref('')
const userStore = useUserStore()
const labelPosition = ref('right')
const router = useRouter()
const isRegister = ref(false)
const isShowPasswork = ref(false)
const phoneVisible = ref(false)
const isShowConfirmPassword = ref(false)
const form = reactive({
  username,
  password,
  code: '',
  confirmPassword: '',
  phone: '',
  phoneCode: '',
})

function sha256(message) {
  if (_.isEmpty(message)) {
    return null
  }
  let hash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
  return hash
}

const onCaptcha = async () => {
  try {
    const res = await captcha()
    if (res.code === 200) {
      svgCode.value = res.data
    }
    // img.src = `data:image/png;base64,${captcha}`;
  } catch (error) {
    console.log(error)
  }
}
onCaptcha()

const onSendCode = async () => {
  if (!form.phone) {
    ElMessage({
      message: '请输入手机号',
      type: 'warning',
    })
    return
  }
  const res = await sendSmsCode({
    phone: form.phone,
    codeType: 'sms',
  })
  if (res.code === 200) {
    ElNotification({
      title: '提示',
      message: '验证码发送成功',
      type: 'success',
    })
  }
}

const onAddPhone = async () => {
  if (!form.phone) {
    ElMessage({
      message: '请输入手机号',
      type: 'warning',
    })
    return
  }
  if (!form.phoneCode) {
    ElMessage({
      message: '请输入验证码',
      type: 'warning',
    })
    return
  }
  const res = await addPhone({
    phone: form.phone,
    code: form.phoneCode,
    userId: loginUserId.value,
    codeType: 'sms',
  })
  if (res.code === 200) {
    ElNotification({
      title: '提示',
      message: '绑定手机号成功',
      type: 'success',
    })
    phoneVisible.value = false
    loginUserId.value = res.data.userId
    router.push('/home')
  } else {
    ElMessage({
      message: '绑定手机号失败',
      type: 'error',
    })
  }
}

const onRegister = async () => {
  const { username, password, confirmPassword } = form

  if (passwordRegex.test(password) === false) {
    ElNotification({
      title: '提示',
      message: '密码必须包含数字、大小写字母且长度在6-20之间',
      type: 'warning',
    })
    return
  }
  if (password !== confirmPassword) {
    ElMessage({
      message: '密码与确认密码不一致',
      type: 'warning',
    })
    return
  }

  const hashedPassword = await sha256(password)
  const res = await register({
    username: form.username,
    password: hashedPassword,
    confirmPassword: hashedPassword,
  })
  if (res.code === 200) {
    ElMessage({
      message: '注册成功',
      type: 'success',
    })
    isRegister.value = false
  } else {
    ElMessage({
      message: '注册失败',
      type: 'error',
    })
  }
}

const onchageLogin = async () => {
  const { username, password, confirmPassword, code, phone, phoneCode } = form
  const hashedPassword = await sha256(password)
  const params =
    activeTab.value === 'account'
      ? {
          username: username,
          password: hashedPassword,
          code: code,
          codeType: 'captcha',
        }
      : { phone, code: phoneCode, codeType: 'sms' }
  const res = await login(params)
  if (res.code === 200) {
    const { email, username, isPhone, userId } = res.data
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('userInfo', JSON.stringify({ email, username }))
    userStore.setNavActive('/home')
    if (!isPhone) {
      ElMessageBox.confirm('还未绑定手机号，是否立即绑定?')
        .then(() => {
          phoneVisible.value = true
          loginUserId.value = userId
        })
        .catch(() => {
          router.push('/home')
        })
      return
    }
    router.push('/home')
  } else {
    ElMessage.error('登录失败')
  }
}
const getImg = async () => {
  return new Promise(async (resolve) => {
    const res = await fetch(ROUND_LOGIN_IMG)
    const data = await res.json()
    resolve(data.url)
  })
}
const getMingyan = async () => {
  try {
    const res = await fetch('https://api.vvhan.com/api/ian/rand')
    const data = await res.text()
    mingyan.value = data
  } catch (error) {
    console.log('error', error)
  }
}

const randomLoginImg = async () => {
  let url = ''
  try {
    const res = await getRandomLoginImg()
    url = res.data.url || defaultBgImg
  } catch (error) {
    url = defaultBgImg
  } finally {
    loginBG.value.style.backgroundImage = `url(${url})`
    // loginTipBG.value.style.backgroundImage = `url(${url})`;
  }
}

watch(mingyan, () => {
  gsap.fromTo(
    loginTipBG.value,
    { opacity: 0, y: 200 }, // 初始位置
    { opacity: 1, y: 0, duration: 3, ease: 'elastic.out(1, 0.3)' } // 动画效果
  )
})

watch(isRegister, (val) => {
  if (val) {
    gsap.fromTo(
      '.m-r',
      { opacity: 0, x: 200 }, // 初始位置
      { opacity: 0.8, x: 0, duration: 3, ease: 'elastic(1, 0.3)' } // 动画效果
    )
  } else {
    gsap.fromTo(
      '.m-r',
      { opacity: 0, x: -200 }, // 初始位置
      { opacity: 0.8, x: 0, duration: 3, ease: 'elastic(1, 0.3)' } // 动画效果
    )
  }
})

onMounted(() => {
  randomLoginImg()
  getMingyan()
})

onMounted(() => {
  gsap.fromTo(
    '.m-r',
    { opacity: 0, y: 200 }, // 初始位置
    { opacity: 0.8, y: 0, duration: 3, ease: 'elastic.out(1, 0.3)' } // 动画效果
  )
})
</script>

<template>
  <div ref="loginBG" class="login-page h-screen flex items-center justify-center">
    <div class="login-modal shadow-2xl rounded-lg w-1/2 h-1/2 flex overflow-hidden">
      <div class="m-l relative w-1/3 border-r-4 flex flex-col items-center justify-center">
        <div class="inner-t"></div>
        <div class="inner-b"></div>
        <div ref="loginTipBG" class="p-4 font-extralight">{{ mingyan }}</div>
        <!-- <img class="h-full w-full object-cover" :src="mingyan.url" alt="" srcset=""> -->
      </div>
      <div class="m-r w-2/3 flex flex-col justify-center items-center">
        <div v-if="!isRegister" class="tabs relative flex items-center justify-center">
          <div v-for="t in loginTabs" :key="t.value" :class="`tab-item mx-2 ${t.value === activeTab ? 'active' : ''}`" @click="activeTab = t.value">{{ t.label }}</div>
        </div>
        <!-- <div class="font-bold text-center text-xl">
          {{ isRegister ? "注册" : "登录" }}
        </div> -->
        <!-- <div class="icons"></div> -->
        <div class="forms w-2/3 p-3">
          <form class="" action="#" @submit.prevent="isRegister ? onRegister() : onchageLogin()">
            <template v-if="activeTab === 'account'">
              <!-- 用户名： -->
              <div class="username flex items-center">
                <input class="email-form-item w-full" v-model="form.username" placeholder="用户" />
                <!-- <div class="prixt emial-prefix">@hsh.com</div> -->
              </div>
              <!-- 密码： -->
              <div class="password flex relative">
                <!-- 可显示可隐藏密码 -->
                <input class="email-form-item w-full" v-model="form.password" placeholder="密码" :type="isShowPasswork ? 'text' : 'password'" />
                <div @click="isShowPasswork = !isShowPasswork" :class="`absolute hover:cursor-pointer translate-y-1/2 right-0 h-6 w-6 ${isShowPasswork ? 'ishowpasswork' : 'isnohowpasswork'}`"></div>
              </div>
              <!-- 验证码： -->
              <div class="captcha flex relative" v-if="!isRegister">
                <input class="email-form-item w-full" v-model="form.code" placeholder="验证码" />
                <div class="hover:cursor-pointer" v-html="svgCode" @click="onCaptcha"></div>
              </div>
              <!-- 确认密码： -->
              <div v-if="isRegister" class="confirm-password flex relative">
                <input class="email-form-item w-full" v-model="form.confirmPassword" placeholder="确认密码" :type="isShowConfirmPassword ? 'text' : 'password'" />
                <div
                  @click="isShowConfirmPassword = !isShowConfirmPassword"
                  :class="`absolute hover:cursor-pointer translate-y-1/2 right-0 h-6 w-6 ${isShowConfirmPassword ? 'ishowpasswork' : 'isnohowpasswork'}`"
                ></div>
              </div>
            </template>

            <template v-if="activeTab === 'captcha'">
              <div class="phone flex relative">
                <input class="email-form-item w-full" v-model="form.phone" placeholder="手机号" />
              </div>
              <div class="captcha flex relative">
                <input class="email-form-item w-full" v-model="form.phoneCode" placeholder="验证码" />
                <el-button class="hover:cursor-pointer" @click="onSendCode">点击发送</el-button>
              </div>
            </template>
            <!-- 右下角的注册切换表单 -->
            <div class="flex justify-between items-center pt-4">
              <el-button class="shadow-inner rounded-3xl text-sm w-1/2 h-10" native-type="submit" type="primary">{{ isRegister ? '注册' : '登录' }}</el-button>
              <div @click="isRegister = !isRegister" class="switch-form flex hover:cursor-pointer justify-center items-center">
                <div class="text-sm">
                  {{ isRegister ? '登录' : '注册' }}
                </div>
                <el-icon class="text-lg"> <Right /> </el-icon>
              </div>
              <!-- 忘记密码 -->
              <div v-if="activeTab === 'account'" class="text-sm forget-passwor">忘记密码?</div>
            </div>
            <!-- 右下角的注册切换表单 -->
          </form>
        </div>
      </div>
    </div>

    <el-dialog v-model="phoneVisible" title="手机绑定" width="800">
      <el-form>
        <div class="phone flex relative">
          <input class="email-form-item w-full" v-model="form.username" placeholder="用户名" disabled />
        </div>
        <div class="phone flex relative">
          <input class="email-form-item w-full" v-model="form.phone" placeholder="手机号" />
        </div>
        <div class="captcha flex relative">
          <input class="email-form-item w-full" v-model="form.phoneCode" placeholder="验证码" />
          <el-button class="hover:cursor-pointer" @click="onSendCode">点击发送</el-button>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onAddPhone"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.login-tip {
  width: 100%;
  height: 100%;
  // margin: 20px;
  // border: 1px solid #ccc;
  background-image: url('@/assets/images/login-tip.png');
  background-size: 100% 100%;
}
.login-modal {
  // background-color: #112d25;
  background: linear-gradient(90deg, #e9f0ee, #ecf3f1);
  color: #110f0f;
  box-shadow: inset -2px -2px 6px #f9f9f9;
  opacity: 0.8;
}
// button {
//   box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
// }
.m-l {
  position: relative;
}
// .m-r {
//   position: relative;
//   &::after {
//     content: "";
//     position: absolute;
//     inset: 0;
//     background-color: rgba(0, 0, 0, 0.5);
//   }
// }
.inner-t {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ecf0f3;
  box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
  top: -16%;
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
input {
  transition: all 0.3s ease-in-out;
  &:focus {
    // color: #b8bec7;
    border-bottom: 2px solid darkcyan;

    /* 在输入框获取焦点时应用的样式 */
    outline: transparent; /* 举例：添加蓝色的边框 */
  }
}
@mixin bgImg {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.ishowpasswork {
  background-image: url('@/assets/images/ico-eye.png');
  @include bgImg;
}
.isnohowpasswork {
  background-image: url('@/assets/images/ico-eye-disabled.png');
  @include bgImg;
}
.switch-form {
  position: relative;
  &:hover {
    ::after {
      width: 100%;
      padding: 0 10px;
    }
  }
}
input {
  transition: all 0.3s ease-in-out;
  &:focus {
    // color: #b8bec7;
    border-bottom: 2px solid darkcyan;

    /* 在输入框获取焦点时应用的样式 */
    outline: transparent; /* 举例：添加蓝色的边框 */
  }
}
.tabs {
  // background: #000;
  // color: #e9f0ee;
  .tab-item {
    position: relative;
    &:hover {
      cursor: pointer;
      ::after {
        width: 100%;
        padding: 0 10px;
      }
    }
    padding: 10px 20px;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      // transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease-in-out;
    }
    &.active {
      color: #af1a1a;
      // border-bottom: #110f0f 2px solid;
    }
  }
}
</style>
