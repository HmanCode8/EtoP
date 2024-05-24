<script setup lang="ts">
import { onMounted, ref, toRef, watch,PropType, watchEffect } from 'vue'
import _ from 'lodash'

const DURATION = 4000

interface ImageItem {
  url: string
  defaultUrl: string
}
const props = defineProps({
  visible: Boolean,
  url: String,
  images: {
    type: Array as PropType<ImageItem[]>,
  },
})
const imgListRef = ref<any>(null)
const timer = ref<any>(null)
const currentUrl = ref()
const currentIndex = ref(-1)
const isPlay = ref(false)
const urlList = toRef<ImageItem[]>([])
const imgView = ref(null)
const emits = defineEmits(['onClose', 'nextPage'])
const showImg = (index: number,play:boolean = false) => {
  isPlay.value = play
  currentIndex.value = index
}

watchEffect(() => {
  if(_.isEmpty(props.images)){
    urlList.value = []
    return
  }
  urlList.value = props.images as ImageItem[]
  if(isPlay.value){
    showImg(currentIndex.value,true)
  }
  console.log('props.images',props.images)
})

const onPreOnchage = () => {
  isPlay.value = false
  currentIndex.value--
  if (currentIndex.value < 0) {
    emits('nextPage',-1)
    currentIndex.value = urlList.value.length
  }
}
const onNextOnchage = () => {
  isPlay.value = false
  currentIndex.value++
  if (currentIndex.value >= urlList.value.length) {
    emits('nextPage',1)
    currentIndex.value = -1
  }
}

const onClose = () => {
  isPlay.value = false

  emits('onClose')
  document.body.style.overflow = 'auto'
}
const zoomIn = () => {
  isPlay.value = false

  const img: any = imgView.value
  let currentScale = null
  try {
    currentScale = img.style.transform.split('scale(')[1].split(')')[0]
  } catch (error) {
    currentScale = 1
  }
  if (Number(currentScale) < 1.5) {
    img.style.transform = `scale(${currentScale * 1.1})`
  }
}
const zoomOut = () => {
  isPlay.value = false

  const img: any = imgView.value
  let currentScale = null
  try {
    currentScale = img.style.transform.split('scale(')[1].split(')')[0]
  } catch (error) {
    currentScale = 1
  }
  if (Number(currentScale) > 1) {
    img.style.transform = `scale(${currentScale * 0.9})`
  }
}

const rotateIn = () => {
  isPlay.value = false

  const img: any = imgView.value
  let currentRotate = null
  try {
    currentRotate = img.style.transform.split('rotate(')[1].split(')')[0]
  } catch (error) {
    currentRotate = '0deg'
  }
  img.style.transform = `rotate(${Number(currentRotate.split('deg')[0]) + 90}deg)`
}

const cleanTranlate = () => {
  isPlay.value = false

  const img: any = imgView.value
  img.style.transform = 'none'
}

const dowLoad = () => {
  isPlay.value = false
  const img: any = imgView.value
  fetch(img.src)
    .then((response) => response.blob())
    .then((blob) => {
      // 创建一个对象URL
      var url = URL.createObjectURL(blob)

      // 创建一个隐藏的<a>元素
      var link = document.createElement('a')
      link.href = url
      link.download = `downloaded_image.${img.src.split('.').pop()}` // 设置下载的文件名

      // 将<a>元素添加到DOM并触发点击事件
      document.body.appendChild(link)
      link.click()

      // 移除<a>元素并释放对象URL
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
    .catch((err) => console.error('Error fetching image', err))
}

const onPlay = () => {
  if (isPlay.value) {
    isPlay.value = false
    return
  }
  isPlay.value = true

  timer.value = setInterval(() => {
    currentIndex.value++
    if (currentIndex.value > urlList.value.length - 1) {
      emits('nextPage',1)
      currentIndex.value = -1
      isPlay.value = true
    }
  }, DURATION)
}

const midCurrent = urlList.value.length / 2
watch(currentIndex, (index) => {
  if (index < 0 || index >= urlList.value.length) {
    return
  }
  if (midCurrent < index) {
    imgListRef.value.scrollTop = (index - midCurrent) * 200
  } else {
    imgListRef.value.scrollTop = 0
  }
  currentUrl.value = urlList.value[index].url
})

onMounted(() => {
  console.log(props.url)
  const findIndex = _.findIndex(urlList.value, (item) => item.url === props.url)
  currentIndex.value = findIndex
})

watch(isPlay, (val) => {
  if (!val) {
    clearInterval(timer.value)
  }
})

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      showImg(0)
    } else {
      onClose()
    }
  }
)
onMounted(() => {
  document.body.style.overflow = 'hidden'
})
</script>

<template>
  <div class="image-viewer relative h-full">
    <div class="h-full w-full flex flex-col justify-center items-center">
      <!-- 工具盒 -->
      <div class="tools">
        <div @click="onClose" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[5%] left-10">
          <el-icon><CircleClose /></el-icon>
        </div>
        <div @click="onPlay" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[10%] left-10">
          <el-icon><VideoPlay v-if="isPlay" /> <VideoPause v-else /></el-icon>
        </div>
        <div @click.stop="onPreOnchage" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[15%] left-10">
          <el-icon><ArrowUpBold /></el-icon>
        </div>
        <div @click.stop="onNextOnchage" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[20%] left-10">
          <el-icon><ArrowDownBold /></el-icon>
        </div>
        <div @click.stop="zoomIn" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[25%] left-10">
          <el-icon><ZoomIn /></el-icon>
        </div>
        <div @click.stop="zoomOut" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[30%] left-10">
          <el-icon><ZoomOut /></el-icon>
        </div>
        <div @click.stop="rotateIn" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[35%] left-10">
          <el-icon><RefreshRight /></el-icon>
        </div>
        <div @click.stop="dowLoad" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[40%] left-10">
          <el-icon><Download /></el-icon>
        </div>
        <div @click.stop="cleanTranlate" class="text-white text-3xl hover:text-amber-300 hover:cursor-pointer flex justify-center items-center absolute top-[45%] left-10">
          <el-icon><Refresh /></el-icon>
        </div>
      </div>

      <img ref="imgView" :src="currentUrl" alt="" srcset="" class="viewer-contain shadow-sm rounded-lg h-2/3 w-1/2 flex justify-center duration-300 items-center object-cover" />

      <div ref="imgListRef" class="img-list h-full absolute duration-300 overflow-hidden right-2">
        <div
          :class="`${u.url === currentUrl ? 'scale-110 border-2 border-blue-500' : ''}  w-40 h-20 shadow-sm rounded-lg img-item mx-1 hover:cursor-pointer hover:scale-125 duration-300`"
          @click="showImg(index)"
          v-for="(u, index) in urlList"
          :key="index"
        >
          <img class="w-full h-full object-cover shadow-sm rounded-lg" :src="u.defaultUrl" alt="" srcset="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
}
</style>
