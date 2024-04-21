<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { register, login } from "@/services/userService";
import { ElMessage } from "element-plus";
//引入主题hook
import useTheme from "@/hooks/useTheme.js";
import { th } from "element-plus/es/locale/index.mjs";

// import type { FormProps } from 'element-plus'
const swithVal = ref(false);
const labelPosition = ref("right");
const router = useRouter();
const store = useStore();
const { currentTheme, toggleTheme } = useTheme();

const form = reactive({
  username: "shiheng he",
  email: "11@email.com",
  password: "123",
});
onMounted(() => {
  console.log(window);
});

// 定义 SHA-256 哈希函数
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const onRegister = async () => {
  const { username, email, password } = form;

  // 对密码进行 SHA-256 哈希
  const hashedPassword = await sha256(password);
  const res = await register({
    username: form.username,
    email: form.email,
    password: hashedPassword,
  });
  if (res.code === 200) {
    ElMessage({
      message: "注册成功",
      type: "success",
    });
  } else {
    ElMessage({
      message: "注册失败",
      type: "error",
    });
  }
};
const onLogin = async () => {
  const hashedPassword = await sha256(form.password);
  const res = await login({
    username: form.username,
    email: form.email,
    password: hashedPassword,
  });
  if (res.code === 200) {
    const { email, username } = res.data;
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("userInfo", JSON.stringify({ email, username }));
    router.push("/email");
  } else {
    console.log("login", res);
  }
  console.log("login", res);
};

// 表单验证规则
/**
 * 邮箱验证规则，参考：https://emailregex.com/
 * 密码验证规则，参考：https://www.regexpal.com/97131
 *
 */

//正则表达式验证规则

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;

const emailRules = [
  { required: true, message: "请输入邮箱", trigger: "blur" },
  { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  {
    validator: (rule, value, callback) => {
      if (!emailRegex.test(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    },
    trigger: "blur",
  },
];
const passwordRules = [
  { required: true, message: "请输入密码", trigger: "blur" },
  { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" },
  {
    validator: (rule, value, callback) => {
      if (!passwordRegex.test(value)) {
        callback(new Error("密码必须包含大小写字母和数字"));
      } else {
        callback();
      }
    },
    trigger: "blur",
  },
];

const formRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
  ],
  email: emailRules,
  password: passwordRules,
};

watchEffect(() => {
  // document.documentElement.dataset.theme = swithVal.value ? "light" : "dark";
  // toggleTheme(swithVal.value);
  swithVal.value = currentTheme.value === "dark";
});
const toggleThemeFn = () => {
  swithVal.value = !swithVal.value;
  // document.documentElement.dataset.theme = swithVal.value ? "light" : "dark";
  toggleTheme(swithVal.value);
};
</script>

<template>
  <el-switch
    class="absolute right-0 p-5"
    @change="toggleThemeFn"
    :model-value="swithVal"
    active-text="暗色"
    inactive-text="亮色"
  />
  <div class="h-screen flex items-center justify-center">
    <div class="login-modal w-1/2 h-1/2 flex email-box-shadow overflow-hidden">
      <div
        class="m-l relative w-1/3 border-r-4 flex flex-col items-center justify-center"
      >
        <div class="inner-t"></div>
        <div class="inner-b"></div>
        <div class="l-title">
          <div class="font-bold text-center text-xl">welcome back!</div>
          <div class="text-sm text-[#c2c6c9]">
            你有账号的话，直接就登录吧，不要麻烦就行！！
          </div>
        </div>
        <div class="l-btn text-white w-full flex justify-center m-10">
          <el-button
            class="shadow-inner rounded-3xl text-sm w-1/2 h-10 text-white"
            type="primary"
            @click="onLogin"
            >SING IN</el-button
          >
        </div>
      </div>
      <div class="m-r w-2/3 flex flex-col justify-center items-center">
        <div class="font-bold text-center text-xl">创建账号</div>
        <div class="text-sm text-[#c2c6c9] p-3">注册账号标识同意协议说明</div>
        <div class="icons"></div>
        <div class="forms w-2/3 p-3">
          <el-form
            :label-position="labelPosition"
            label-width="auto"
            :model="form"
            :rules="formRules"
          >
            <el-form-item prop="username">
              <el-input
                class="custom-input"
                placeholder="Name"
                v-model="form.username"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                class="custom-input"
                placeholder="Email"
                v-model="form.email"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                class="custom-input"
                placeholder="Password"
                v-model="form.password"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="shadow-inner rounded-3xl text-sm w-1/2 h-10 text-white"
                type="primary"
                @click="onRegister"
                >SING UP</el-button
              >
            </el-form-item>
          </el-form>
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
