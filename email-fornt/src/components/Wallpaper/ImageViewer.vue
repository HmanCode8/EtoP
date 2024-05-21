<script setup lang="ts">
import { onMounted, ref, toRef, watch } from "vue";
const props = defineProps({
  visible: Boolean,
  url: String,
  images: {
    type: Array,
  },
});

const currentUrl = toRef(props.url);
const currentIndex = ref(0);
const urlList = toRef<any>(props.images);
const imgView = ref(null);
const emits = defineEmits(["onClose"]);
const showImg = (index: number) => {
  currentIndex.value = index;
};

const onPreOnchage = () => {
  currentIndex.value--;
  if (currentIndex.value < 0) {
    currentIndex.value = urlList.value.length - 1;
  }
};
const onNextOnchage = () => {
  currentIndex.value++;
  if (currentIndex.value >= urlList.value.length) {
    currentIndex.value = 0;
  }
};
watch(currentIndex, (index) => {
  if (index < 0 || index >= urlList.value.length) {
    return;
  }
  currentUrl.value = urlList.value[index];
});
const onClose = () => {
  emits("onClose");
  document.body.style.overflow = "auto";
};
const zoomIn = () => {
  const img: any = imgView.value;
  let currentScale = null;
  try {
    currentScale = img.style.transform.split("scale(")[1].split(")")[0];
  } catch (error) {
    currentScale = 1;
  }
  if (Number(currentScale) < 1.6) {
    img.style.transform = `scale(${currentScale * 1.1})`;
  }
};
const zoomOut = () => {
  const img: any = imgView.value;
  let currentScale = null;
  try {
    currentScale = img.style.transform.split("scale(")[1].split(")")[0];
  } catch (error) {
    currentScale = 1;
  }
  if (Number(currentScale) > 1) {
    img.style.transform = `scale(${currentScale * 0.9})`;
  }
};

const onPlay = () => {
  const timeer = setInterval(() => {
    const index = urlList.value.indexOf(currentUrl.value);
    if (index < urlList.value.length - 1) {
      showImg(index + 1);
    } else {
      clearInterval(timeer);
    }
  }, 3000);
};
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      showImg(0);
    } else {
      onClose();
    }
  }
);
onMounted(() => {
  document.body.style.overflow = "hidden";
});
</script>

<template>
  <div class="image-viewer relative h-full">
    <div class="h-full w-full flex flex-col justify-center items-center">
      <!-- 顺序播放 -->
      <div>
        <div
          @click="onPlay"
          class="text-white hover:cursor-pointer flex justify-center items-center absolute top-10 left-10"
        >
          播放
        </div>
      </div>
      <div
        @click="onClose"
        class="rounded-full text-white text-3xl hover:cursor-pointer absolute top-10 right-10"
      >
        <el-icon><CircleClose /></el-icon>
      </div>
      <div
        @click.stop="onPreOnchage"
        class="pre text-white text-3xl hover:cursor-pointer absolute left-10"
      >
        <el-icon><ArrowLeftBold /></el-icon>
      </div>
      <div
        @click.stop="onNextOnchage"
        class="next text-white text-3xl hover:cursor-pointer absolute hover:scale-150 right-10"
      >
        <el-icon><ArrowRightBold /></el-icon>
      </div>

      <div
        ref="imgView"
        class="viewer-contain h-96 flex justify-center duration-300 items-center"
      >
        <img
          class="w-full h-full object-cover"
          :src="currentUrl"
          alt=""
          srcset=""
        />
      </div>

      <div class="flex mt-1 w-1/3 justify-center items-center">
        <div @click="zoomIn" class="zoom-out text-3xl hover:cursor-pointer">
          <el-icon><ZoomIn /></el-icon>
        </div>

        <div @click="zoomOut" class="zoom-in text-3xl hover:cursor-pointer">
          <el-icon><ZoomOut /></el-icon>
        </div>
      </div>
      <div
        ref="imgListRef"
        class="img-list h-full mt-4 absolute bottom-10 right-0"
      >
        <div
          :class="`${
            url === currentUrl ? 'scale-150 border-2 border-blue-500' : ''
          }  w-20 h-20 img-item mx-1 hover:cursor-pointer hover:scale-125 duration-300`"
          @click="showImg(index)"
          v-for="(url, index) in urlList"
          :key="index"
        >
          <img class="w-full h-full object-cover" :src="url" alt="" srcset="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
}
</style>
