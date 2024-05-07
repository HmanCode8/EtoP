<template>
  <div class="relative ">
    <div
      class="avatar-box scale-100 hover:scale-110 duration-300 rounded-full w-16 h-16"
      @click="clickAvatarBox"
    >
      <input
        type="file"
        hidden
        ref="fileInputRef"
        accept="image/x-png,image/gif,image/jpeg,image/bmp"
        @change="changeFile"
      />
      <img v-if="imgUrl" :src="imgUrl" alt="" />
    </div>

    <el-dialog v-model="showPreview" title="图片详情" width="50%" draggable>
      <div class="flex">
        <img
          class="shadow-lg w-full h-1/2 rounded-lg object-cover"
          :src="imgUrl"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { uploadAvatar, getAvatar } from "@/services/userService";
import { ElMessage } from "element-plus";
import { ref, reactive, watch, watchEffect, onMounted } from "vue";
const props = defineProps({
  userInfo: {
    type: Object,
  },
  action: {
    type: String,
    default: "upload",
  },
});
const fileInputRef = ref(null);
const imgUrl = ref("");
const showPreview = ref(false);
function clickAvatarBox() {
  if (props.action === "preview") {
    showPreview.value = true;
    return;
  }
  fileInputRef.value.click();
}
onMounted(async () => {
  const result = await getAvatar();
  imgUrl.value = result.data.avatar;
});
async function changeFile() {
  try {
    let file = fileInputRef.value.files[0];

    const res = await uploadAvatar({ file });
    if (res) {
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
.avatar-box {
  cursor: pointer;
  position: relative;
  border: 2px solid #fff;
  overflow: hidden;
  &:hover::before {
    content: "";
    display: block;
    position: absolute;
    // z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.3);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
