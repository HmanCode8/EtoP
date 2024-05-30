<script setup>
import { ref, reactive, onMounted, watchEffect, inject, watch } from 'vue'
import CryptoJS from 'crypto-js'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { register, captcha, sendSmsCode, addPhone, login, updatePassword } from '@/services/userService'
import { getRandomLoginImg } from '@/services/wallpaperService'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import defaultBgImg from '@/assets/images/sky.jpeg'
import { useUserStore } from '@/store'

const tabs = [
  {
    label: '账号密码',
    value: 'account',
  },
  {
    label: '手机短信',
    value: 'captcha',
  },
]
const ROUND_LOGIN_IMG = 'https://api.vvhan.com/api/wallpaper/views?type=json'
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/

const username = import.meta.env.VITE_LOGIN_USER ?? ''
const password = import.meta.env.VITE_LOGIN_PASSWORD ?? ''
const loginUserId = ref('')
const codeTimeOut = ref(0)
const intervalId = ref(null)
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
const isUpdatePassword = ref(false)
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

function myMessageInfo(message, type) {
  ElNotification({
    title: '提示',
    message,
    type,
  })
}

function sha256(message) {
  if (_.isEmpty(message)) {
    return null
  }
  let hash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
  return hash
}

const onCaptcha = async () => {
  try {
    if(!_.isEmpty(form.code)){
      form.code = ''
    }
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
    myMessageInfo('请输入手机号', 'warning')
    return
  }
  const res = await sendSmsCode({
    phone: form.phone,
    codeType: 'sms',
  })
  if (res.code === 200) {
    myMessageInfo('验证码发送成功', 'success')
    codeTimeOut.value = 60 * 5
    intervalId.value = setInterval(() => {
      codeTimeOut.value--
      if (codeTimeOut.value === 0) {
        clearInterval(intervalId.value)
      }
    }, 1000)
  }
}

const onAddPhone = async () => {
  if (!form.username) {
    return myMessageInfo('请输入用户名', 'warning')
  }

  if (!form.phone) {
    return myMessageInfo('请输入手机号', 'warning')
  }
  if (!form.phoneCode) {
    return myMessageInfo('请输入验证码', 'warning')
  }
  const res = await addPhone({
    phone: form.phone,
    code: form.phoneCode,
    userId: loginUserId.value,
    username: form.username,
    codeType: 'sms',
  })
  if (res.code === 200) {
    myMessageInfo('绑定手机号成功', 'success')
    phoneVisible.value = false
    loginUserId.value = res.data.userId
    router.push('/home')
  } else {
    myMessageInfo('绑定手机号失败', 'error')
  }
}

const checkPhone = (callback) => {
  ElMessageBox.confirm('还未绑定手机号，是否立即绑定?')
    .then(() => {
      phoneVisible.value = true
      loginUserId.value = userId
    })
    .catch(() => callback())
}

const onRegister = async () => {
  const { username, password, confirmPassword } = form

  if (passwordRegex.test(password) === false) {
    myMessageInfo('密码必须包含数字、大小写字母且长度在6-20之间', 'warning')
    return
  }
  if (password !== confirmPassword) {
    myMessageInfo('密码与确认密码不一致', 'warning')
    return
  }

  const hashedPassword = await sha256(password)
  const res = await register({
    username: form.username,
    password: hashedPassword,
    confirmPassword: hashedPassword,
  })
  if (res.code === 200) {
    myMessageInfo('注册成功', 'success')
    ElMessageBox.confirm('还未绑定手机号，是否立即绑定?')
      .then(() => {
        phoneVisible.value = true
        loginUserId.value = userId
      })
      .catch(() => {
        isRegister.value = false
      })
    return
  }
  //  else {
  //   myMessageInfo('注册失败', 'error')
  // }
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
      ElMessageBox.confirm('还未绑定手机号，是否立即绑定?', {
        cancelButtonText: '稍后再说',
      })
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
  }
  //  else {
  //   myMessageInfo('登录失败', 'error')
  // }
}
const onchagePassword = async () => {
  const { password, confirmPassword, phone, phoneCode } = form
  if (password !== confirmPassword) {
    myMessageInfo('密码与确认密码不一致', 'warning')
    return
  }
  const hashedPassword = await sha256(password)

  const res = await updatePassword({ phone, code: phoneCode, password: hashedPassword, codeType: 'sms' })
  if (res.code === 200) {
    myMessageInfo('修改密码成功', 'success')
  } else {
    myMessageInfo('修改密码失败', 'error')
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
    myMessageInfo('获取名句失败', 'error')
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

const dblclick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  randomLoginImg()
  getMingyan()
}

watch(mingyan, () => {
  const romdomNum = Math.floor(Math.random() * 10)
  if (romdomNum > 5) {
    gsap.fromTo(
      loginTipBG.value,
      { opacity: 0, y: -100, x: -50 }, // 初始位置
      { opacity: 1, y: 0, x: 0, duration: 3, ease: 'bounce.out(1, 0.3)' } // 动画效果
    )
  } else {
    gsap.fromTo(
      loginTipBG.value,
      { opacity: 0, x: 200 }, // 初始位置
      { opacity: 1, x: 0, duration: 3, ease: 'elastic.out(1, 0.3)' } // 动画效果
    )
  }
})

watch([isRegister, isUpdatePassword], (val) => {
  if (val) {
    gsap.fromTo(
      '.m-r',
      { opacity: 0, x: 200 }, // 初始位置
      { opacity: 0.95, x: 0, duration: 3, ease: 'elastic(1, 0.3)' } // 动画效果
    )
  } else {
    gsap.fromTo(
      '.m-r',
      { opacity: 0, x: -200 }, // 初始位置
      { opacity: 0.95, x: 0, duration: 3, ease: 'elastic(1, 0.3)' } // 动画效果
    )
  }
})
watch(activeTab, (val) => {
  if (val === 'captcha') {
    gsap.fromTo(
      '.forms',
      { opacity: 0, x: 200 }, // 初始位置
      { opacity: 0.95, x: 0, duration: 3, ease: 'elastic(1, 0.3)' } // 动画效果
    )
  } else {
    gsap.fromTo(
      '.forms',
      { opacity: 0, x: -200 }, // 初始位置
      { opacity: 0.95, x: 0, duration: 3, ease: 'elastic(1, 0.3)' } // 动画效果
    )
  }
})

watch([activeTab, phoneVisible], (val) => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    codeTimeOut.value = 0
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
    { opacity: 0.95, y: 0, duration: 3, ease: 'elastic.out(1, 0.3)' } // 动画效果
  )
})
</script>

<template>
  <div ref="loginBG" class="login-page h-screen flex items-center justify-center">
    <div class="login-modal shadow-2xl rounded-lg w-1/2 h-1/2 flex overflow-hidden">
      <div @dblclick="dblclick" class="m-l relative w-1/3 border-r-4 flex flex-col items-center justify-center">
        <!-- <div @click="getMingyan" class="absolute left-1 top-0">
          <el-icon><Search /></el-icon>
        </div> -->
        <div class="inner-t"></div>
        <div class="inner-b"></div>
        <div ref="loginTipBG" class="famole p-4 font-extralight">{{ mingyan }}</div>
        <!-- <img class="h-full w-full object-cover" :src="mingyan.url" alt="" srcset=""> -->
      </div>
      <div class="m-r w-2/3 relative flex flex-col justify-center items-center">
        <div class="bg-white famole inner-title rounded-full w-20 h-20 text-sm shadow-lg absolute left-4 top-4 flex justify-center items-center">
          {{ isRegister ? '注册' : isUpdatePassword ? '修改密码' : '登录' }}
        </div>
        <div v-if="!isRegister && !isUpdatePassword" class="tabs famole-t relative h-20 flex items-center justify-center">
          <div v-for="t in loginTabs" :key="t.value" :class="`tab-item mx-2 ${t.value === activeTab ? 'active' : ''}`" @click="activeTab = t.value">
            {{ t.label }}
          </div>
        </div>
        <!-- <div class="font-bold text-center text-xl">
          {{ isRegister ? "注册" : "登录" }}
        </div> -->
        <!-- <div class="icons"></div> -->
        <div class="forms m-auto w-2/3 p-3">
          <form class="" action="#" @submit.prevent="isRegister ? onRegister() : isUpdatePassword ? onchagePassword() : onchageLogin()">
            <template v-if="activeTab === 'account'">
              <template v-if="isUpdatePassword">
                <div class="phone flex relative">
                  <input class="email-form-item w-full" v-model="form.phone" placeholder="手机号" />
                </div>
                <div class="captcha flex items-center relative">
                  <input class="email-form-item w-full" v-model="form.phoneCode" placeholder="验证码" />
                  <el-button :disabled="codeTimeOut > 0" class="hover:cursor-pointer" @click="onSendCode"
                    >{{ codeTimeOut === 0 ? '发送' : '' }}<span v-if="codeTimeOut > 0">{{ codeTimeOut }}{{ codeTimeOut > 0 ? '秒后重发' : '' }}</span></el-button
                  >
                </div>
              </template>
              <!-- 用户名： -->
              <div class="username flex items-center" v-if="!isUpdatePassword">
                <input class="email-form-item w-full" v-model="form.username" placeholder="用户名" />
                <!-- <div class="prixt emial-prefix">@hsh.com</div> -->
              </div>
              <!-- 密码： -->
              <div class="password flex relative">
                <!-- 可显示可隐藏密码 -->
                <input class="email-form-item w-full" v-model="form.password" placeholder="密码" :type="isShowPasswork ? 'text' : 'password'" />
                <div @click="isShowPasswork = !isShowPasswork" :class="`absolute hover:cursor-pointer translate-y-1/2 right-0 h-6 w-6 ${isShowPasswork ? 'ishowpasswork' : 'isnohowpasswork'}`"></div>
              </div>
              <!-- 验证码： -->
              <div class="captcha flex relative" v-if="!isRegister && !isUpdatePassword">
                <input class="email-form-item w-full" v-model="form.code" placeholder="验证码" />
                <div class="hover:cursor-pointer" v-html="svgCode" @click="onCaptcha"></div>
              </div>
              <!-- 确认密码： -->
              <div v-if="isRegister || isUpdatePassword" class="confirm-password flex relative">
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
              <div class="captcha flex items-center relative">
                <input class="email-form-item w-full" v-model="form.phoneCode" placeholder="验证码" />
                <el-button :disabled="codeTimeOut > 0" class="hover:cursor-pointer" @click="onSendCode"
                  >{{ codeTimeOut === 0 ? '发送' : '' }}<span v-if="codeTimeOut > 0">{{ codeTimeOut }}{{ codeTimeOut > 0 ? '秒后重发' : '' }}</span></el-button
                >
              </div>
            </template>
            <!-- 右下角的注册切换表单 -->
            <div class="flex justify-between items-center pt-4">
              <el-button class="login-btn shadow-inner rounded-3xl text-sm w-1/2 h-10" native-type="submit" type="primary">{{ isRegister ? '注册' : isUpdatePassword ? '修改密码' : '登录' }}</el-button>
              <div v-if="activeTab === 'account' && !isUpdatePassword" @click="isRegister = !isRegister" class="switch-form flex hover:cursor-pointer justify-center items-center hover:text-[#1f9594]">
                <div class="text-sm ">
                  {{ isRegister ? '登录' : '注册' }}
                </div>
                <el-icon class="text-lg"> <Right v-if="!isRegister" /> <Back v-else /> </el-icon>
              </div>
              <div v-if="activeTab !== 'account' && !isUpdatePassword" @click="phoneVisible = true" class="switch-form flex hover:cursor-pointer justify-center items-center hover:text-[#1f9594]">
                <div class="text-sm ">绑定手机号</div>
              </div>
              <!-- 忘记密码 -->
              <div v-if="activeTab === 'account' && !isRegister" @click="isUpdatePassword = !isUpdatePassword" class="text-sm forget-passwor hover:cursor-pointer hover:text-[#1f9594]">
                {{ isUpdatePassword ? '返回登录' : '忘记密码?' }}
              </div>
            </div>
            <!-- 右下角的注册切换表单 -->
          </form>
        </div>
      </div>
    </div>

    <el-dialog v-model="phoneVisible" title="手机绑定" width="800">
      <form class="phone-form">
        <div class="phone flex items-center relative">
          用户名：
          <input class="email-form-item w-1/2" v-model="form.username" placeholder="用户名" />
        </div>
        <div class="phone flex items-center relative">
          手机号：
          <input class="email-form-item w-1/2" v-model="form.phone" placeholder="手机号" />
        </div>
        <div class="phone flex items-center relative">
          验证码：
          <input class="email-form-item w-1/2" v-model="form.phoneCode" placeholder="验证码" />
          <el-button :disabled="codeTimeOut > 0" class="hover:cursor-pointer" @click="onSendCode"
            >{{ codeTimeOut === 0 ? '发送' : '' }}<span v-if="codeTimeOut > 0">{{ codeTimeOut }}{{ codeTimeOut > 0 ? '秒后重发' : '' }}</span></el-button
          >
        </div>
      </form>
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
  background-image: url('@/assets/images/login-tip.png');
  background-size: 100% 100%;
}
.login-modal {
  background: linear-gradient(90deg, #e9f0ee, #ecf3f1);
  color: #110f0f;
  box-shadow: inset -2px -2px 6px #f9f9f9;
  opacity: 0.95;
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
.famole{
  /* 清除默认的文本颜色 */  
  color: transparent;  
    
  /* 使用渐变作为背景 */  
  background: linear-gradient(to right, red, blue, green, yellow);  
    
  /* 使用背景色作为文本颜色（剪裁背景到文本区域） */  
  -webkit-background-clip: text;  
  background-clip: text;  
    
  /* 为了更好地显示渐变效果，可能需要设置文本为粗体或添加一些文本阴影 */  
  font-weight: bold;  
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);  
     /* 添加文字阴影 */  
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);  
  /* 为了确保渐变在所有浏览器中都能正确显示，你可能需要添加浏览器前缀 */  
  /* （这里只展示了WebKit前缀）*/  
}
.famole-t{
  background: linear-gradient(to right, red, blue, green, yellow);  
  -webkit-background-clip: text;  
  background-clip: text;  
  font-weight: bold;  
  text-shadow: 0px 10px 8px rgba(0, 0, 0, 0.1);  
  
}
.inner-title {
  box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
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
      color: darkcyan;
      box-shadow: inset 8px 8px 12px #f1ecec, inset -8px -8px 12px #fff;

      // border-bottom: #110f0f 2px solid;
    }
  }
}
.forms {
  input {
    font-size: 14px;
    margin: 2px 0;
    transition: all 0.3s ease-in-out;
    border-bottom: 1px solid rgb(170, 221, 221);
    &:focus {
      // color: #b8bec7;
      border-bottom: 2px solid darkcyan;

      /* 在输入框获取焦点时应用的样式 */
      outline: transparent; /* 举例：添加蓝色的边框 */
    }
  }
}
.phone-form {
  input {
    transition: all 0.3s ease-in-out;
    border-bottom: 1px solid rgb(200, 232, 232);
    &:focus {
      // color: #b8bec7;

      /* 在输入框获取焦点时应用的样式 */
      outline: transparent; /* 举例：添加蓝色的边框 */
    }
  }
}
.login-btn{
  cursor: pointer;
  transition: 0.5s;
&:hover {
  border: 1px solid rgba(255,255,255,1);
  transform: scale(0.98);
}
}
</style>
