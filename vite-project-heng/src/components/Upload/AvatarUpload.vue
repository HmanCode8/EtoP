<template>
  <div class="avatar-upload-wrapper">
    <!-- {{ modelValue }} -->
    <div
      :class="['avatar-box', { 'avatar-box-border': imgUrl ? false : true }]"
      @click="clickAvatarBox"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <!-- 隐藏的input的type=file -->
      <input
        type="file"
        hidden
        ref="fileInputRef"
        accept="image/x-png,image/gif,image/jpeg,image/bmp"
        @change="changeFile"
      />
      <img v-if="imgUrl" :src="imgUrl" alt="" />
      <div v-else class="avatar-marker">
        <i class="iconfont icon-jiahao"></i>
      </div>
    </div>
  </div>
</template>
<script setup>
import { uploadAvatar, getAvatar } from "@/services/userService";
import { ElMessage } from "element-plus";
import { ref, reactive, watch, watchEffect } from "vue";
import { useStore } from "vuex";
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  userInfo: {
    type: Object,
  },
  size: {
    type: Number,
    default: 64,
  },
  modelValue: {
    type: String,
    default: "", // 默认头像链接地址
  },
  maxSize: {
    type: Number,
    default: 5, // 默认最大不超过5M
  },
});
const fileInputRef = ref(null);
const store = useStore();
const imgUrl = ref("");
function clickAvatarBox() {
  fileInputRef.value.click();
}

watchEffect(() => {
  imgUrl.value = store.state.userAvatar;
});
async function changeFile() {
  try {
    let file = fileInputRef.value.files[0];
    if (file.size / 1024 / 1024 > props.maxsize) {
      return ElMessage({
        message: "文件超过指定大小",
        type: "waring",
      });
    }

    const res = await uploadAvatar({ file });
    if (res) {
      ElMessage({
        message: "上传成功",
        type: "success",
      });
      const result = await getAvatar();
      imgUrl.value = result.data.avatar;
      console.log(result);
    }
  } catch (error) {
    ElMessage({
      message: "上传失败",
      type: "error",
    });
  }
}
</script>
<style lang="scss" scoped>
.avatar-box-border {
  border: 1px dashed #409eff !important;
}
.avatar-box {
  border-radius: 50%;
  margin-left: 20px;
  cursor: pointer;
  position: relative;
  border: 2px solid #eee;
  overflow: hidden;
  &:hover::before {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.03);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .avatar-marker {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #409eff;
    i.iconfont {
      font-size: 24px;
    }
  }
}
</style>
