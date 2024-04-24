<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import CryptoJS from "crypto-js";
import { ElMessage } from "element-plus";
import { register, login } from "@/services/userService";
import { useRouter } from "vue-router";
import _ from "lodash";
const labelPosition = ref("right");
const router = useRouter();
const isRegister = ref(false);
const form = reactive({
  username: "my123",
  password: "123",
  confirmPassword: "",
});

onMounted(() => {
  console.log(window);
});

function sha256(message) {
  if (_.isEmpty(message)) {
    return null;
  }
  let hash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
  return hash;
}

const onRegister = async () => {
  const { username, password, confirmPassword } = form;
  if (password !== confirmPassword) {
    ElMessage({
      message: "密码与确认密码不一致",
      type: "error",
    });
    return;
  }

  const hashedPassword = await sha256(password);
  const res = await register({
    username: form.username,
    password: hashedPassword,
    confirmPassword: hashedPassword,
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

const onchageLogin = async () => {
  const { username, password, confirmPassword } = form;
  // 登录表单检验，检验用户密码
  // if()
  const hashedPassword = await sha256(password);
  const res = await login({
    username: username,
    password: hashedPassword,
  });
  if (res.code === 200) {
    const { email, username } = res.data;
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("userInfo", JSON.stringify({ email, username }));
    // router.push("/email");
    router.push("/home");
  } else {
    console.log("login", res);
  }
  console.log("login", res);
};
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div
      class="login-modal rounded-lg w-1/2 h-1/2 flex email-box-shadow overflow-hidden"
    >
      <div
        class="m-l relative w-1/3 border-r-4 flex flex-col items-center justify-center"
      >
        <div class="inner-t"></div>
        <div class="inner-b"></div>
        <div class="l-title">
          <!-- <div class="login-tip"></div> -->

          <div class="font-bold text-center text-xl">welcome back!</div>
          <!-- <div class="text-sm text-[#c2c6c9]">选择你喜欢的主题进入</div> -->
        </div>
        <div class="l-btn text-white w-full flex justify-center m-10">
          <!-- <el-button
            class="shadow-inner rounded-3xl text-sm w-1/2 h-10 text-white"
            type="primary"
            @click="onLogin"
            >SING IN</el-button
          > -->
          <!-- <el-switch
            class="absolute right-0 p-5"
            @change="toggleThemeFn"
            :model-value="swithVal"
            active-text="dark"
            inactive-text="light"
          /> -->
        </div>
      </div>
      <div class="m-r w-2/3 flex flex-col justify-center items-center">
        <div class="font-bold text-center text-xl">
          {{ isRegister ? "注册" : "登录" }}
        </div>
        <div class="icons"></div>
        <div class="forms w-2/3 p-3">
          <form
            action="#"
            @submit.prevent="isRegister ? onRegister() : onchageLogin()"
          >
            <div class="username flex items-center">
              <input
                class="email-form-item w-full"
                v-model="form.username"
                placeholder="username"
              />
              <div class="prixt emial-prefix">@hsh.com</div>
            </div>
            <div class="password flex">
              <!-- 可显示可隐藏密码 -->
              <input
                class="email-form-item w-full"
                v-model="form.password"
                placeholder="password"
                type="password"
              />
            </div>
            <div v-if="isRegister" class="confirm-password flex">
              <input
                class="email-form-item w-full"
                v-model="form.confirmPassword"
                placeholder="confirmPassword"
                type="password"
              />
            </div>
            <div class="btn-box flex justify-between pt-4">
              <el-button
                class="shadow-inner rounded-3xl text-sm w-1/2 h-10"
                native-type="submit"
                type="primary"
                >{{ isRegister ? "SING UP" : "SING IN" }}</el-button
              >
              <div
                class="switch-form flex hover:cursor-pointer justify-center items-center"
              >
                <div class="text-sm">
                  {{ isRegister ? "Login" : "Register" }}
                </div>
                <el-icon class="text-lg" @click="isRegister = !isRegister">
                  <Right
                /></el-icon>
              </div>
            </div>
            <!-- 右下角的注册切换表单 -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-tip {
  width: 100%;
  height: 100%;
  // margin: 20px;
  // border: 1px solid #ccc;
  background-image: url("@/assets/images/login-tip.png");
  background-size: 100% 100%;
}
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
input:focus {
  /* 在输入框获取焦点时应用的样式 */
  outline: transparent; /* 举例：添加蓝色的边框 */
}
</style>
