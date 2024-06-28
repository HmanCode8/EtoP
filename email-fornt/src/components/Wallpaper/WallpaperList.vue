<script setup lang="ts">
import { ref, watch, inject, computed, nextTick, onMounted, onUpdated } from 'vue'
import defaultUrl from '@/assets/loading.gif'
import { getWallpaper } from '@/services/wallpaperService'
import { PixabayImage } from '@/interfaces/wallpaper'
import _ from 'lodash'
import Category from './Category.vue'
import Panination from '@/components/Until/Panination.vue'
import ImageViewer from '@/components/Wallpaper/ImageViewer.vue'
// import { useLazyLoad } from "@/hooks/useIntersectionObserver";

const gsap: any = inject('gsap')
const SOURCE_PREFIX = 'heshiheng'
const TARGET_PREFIX = 'pixabay'
const base64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSIgdmlld0JveD0iMCAwIDQ1IDQ1IiBzdHJva2U9IiNmZmYiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSAxKSIgc3Ryb2tlLXdpZHRoPSIyIj48Y2lyY2xlIGN4PSIyMiIgY3k9IjIyIiByPSI2IiBzdHJva2Utb3BhY2l0eT0iMCI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgYmVnaW49IjEuNXMiIGR1cj0iM3MiIHZhbHVlcz0iNjsyMiIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIgYmVnaW49IjEuNXMiIGR1cj0iM3MiIHZhbHVlcz0iMTswIiBjYWxjTW9kZT0ibGluZWFyIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS13aWR0aCIgYmVnaW49IjEuNXMiIGR1cj0iM3MiIHZhbHVlcz0iMjswIiBjYWxjTW9kZT0ibGluZWFyIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIyIiBjeT0iMjIiIHI9IjYiIHN0cm9rZS1vcGFjaXR5PSIwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiBiZWdpbj0iM3MiIGR1cj0iM3MiIHZhbHVlcz0iNjsyMiIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIgYmVnaW49IjNzIiBkdXI9IjNzIiB2YWx1ZXM9IjE7MCIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utd2lkdGgiIGJlZ2luPSIzcyIgZHVyPSIzcyIgdmFsdWVzPSIyOzAiIGNhbGNNb2RlPSJsaW5lYXIiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMjIiIGN5PSIyMiIgcj0iOCI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgYmVnaW49IjBzIiBkdXI9IjEuNXMiIHZhbHVlcz0iNjsxOzI7Mzs0OzU7NiIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L2NpcmNsZT48L2c+PC9zdmc+'
const wallpaperList = ref<PixabayImage[]>([])
const wallpaperTotal = ref(0)
const loading = ref<HTMLDivElement>(null as any)
const scrollContainer = ref(null)
const page = ref<any>(1)
const pageSize = ref(20)
const lazyImg = ref<HTMLImageElement>(null as any)
const categoryId = ref<string>('')
const dialogVisible = ref(false)
const imgDetail = ref<PixabayImage>({} as PixabayImage)

let items = [] as any


const handleWallpaperList = async (category?: string) => {
  try {
    const params: any = {
      page: page.value,
      pageSize: pageSize.value,
      imgType: 'photo',
      // photoVal: "黄色​​花",
      category: category || categoryId.value,
    }
    const res = await getWallpaper(params)
    if (res.code === 200) {
      const data = res.data.hits.map((item: any) => _.mapValues(item, (value: string) => (_.includes(value, SOURCE_PREFIX) ? value.replace(SOURCE_PREFIX, TARGET_PREFIX) : value)))
      wallpaperList.value = data
      wallpaperTotal.value = res.data.totalHits
    }
  } catch (error) {
    console.log(error)
  }
}
watch(
  [page, categoryId],
  () => {
    handleWallpaperList()
  },
  {
    immediate: true,
  }
)

watch(wallpaperList, () => {
  nextTick(() => {
    gsap.fromTo('.wallpaper-item', { opacity: 0, x: 200 }, { opacity: 1, x: 0, duration: 3, ease: 'bounce' })
    gsap.fromTo('.wallpaper-item-reverse', { opacity: 0, y: 200 }, { opacity: 1, y: 0, duration: 3, ease: 'back' })
  })
})

const handleCategoryClick = (cateId: string) => {
  if (page.value !== 1) {
    page.value = 1
    return
  }

  categoryId.value = cateId
}

const onNextPage = (number: number) => {
  page.value += number
}

const addPage = () => {
  if (page.value * pageSize.value >= wallpaperTotal.value) {
    loading.value.style.display = 'none'
    return
  }
  page.value += 1
  // handleWallpaperList()
}

const waterfallLayout = (items: HTMLDivElement[]) => {
  const container = document.getElementById('waterfall-container') as HTMLDivElement
  const containerWidth = container.clientWidth
  const itemWidth = 300 // 每个卡片的宽度
  const columnCount = Math.floor(containerWidth / itemWidth)
  const columnHeights = new Array(columnCount).fill(0)

  items.forEach((item) => {
    const minColumnHeight = Math.min(...columnHeights)
    const columnIndex = columnHeights.indexOf(minColumnHeight)

    const x = columnIndex * itemWidth
    const y = minColumnHeight

    item.style.transform = `translate(${x}px, ${y}px)`

    columnHeights[columnIndex] += item.clientHeight // 16 是 margin-bottom 的值
  })

  const maxHeight = Math.max(...columnHeights)
  container.style.height = `${maxHeight}px`
}

const onCreateImges = (data: PixabayImage[]) => {
  const container = document.getElementById('waterfall-container') as HTMLDivElement
  data.forEach((imageData) => {
    const item = document.createElement('div')
    item.classList.add('waterfall-item')
    item.style.width = '300px'
    item.style.padding = '10px'
    item.style.position = 'absolute'
    const img = document.createElement('img')
    img.classList.add('lazy-load')
    img.src = imageData.webformatURL
    img.style.border = '2px solid #fff'

    img.onload = () => {
      items = [...items,item]
      container.append(item)
      waterfallLayout(items)
    }

    item.appendChild(img)
  })
}

// 在组件挂载后调用懒加载函数
watch(wallpaperList, (val) => {
  onCreateImges(val)
})

const puts = computed(() => {
  return {
    pageTotal: Math.ceil(wallpaperTotal.value / pageSize.value),
    images: wallpaperList.value.map((w) => ({
      defaultUrl: w.webformatURL,
      url: w.largeImageURL,
    })),
  }
})
</script>

<template>
  <div class="mb-5 w-full email-car-bg-color">
    <div class="wallpaper-h h-10 border-b"></div>
    <Category @onCategoryClick="handleCategoryClick" />
  </div>
  <ImageViewer @onClose="() => (dialogVisible = false)" @nextPage="onNextPage" v-if="dialogVisible" :url="imgDetail.largeImageURL" :images="puts.images" />
  <div ref="scrollContainer" v-infinite-scroll="addPage" id="waterfall-container" class="waterfall-container"></div>
  <div ref="loading" class="loading-more w-full flex justify-center items-center text-gray-400">加载更多....</div>
  <!-- <Panination :currentPage="page" :pageTotal="puts.pageTotal" @pageChange="(p) => (page = p)" /> -->
</template>

<style scoped lang="scss">
.wallpaper-list {
  $count: 3;
  --theme: #9999ff;
  .wallpaper-item,
  .wallpaper-item-reverse {
    // --n: $count /* 图片数量 */;
    --w: 300px;
    --h: 200px;
    --s: calc((100% - var(--w) * var(--n)) / var(--n) / 2);
    // margin: 10px var(--s);
    margin: 10px;
    width: var(--w);
    height: var(--h);
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: 3px 5px 5px rgba(33, 32, 32, 0.1);
    img {
      background-size: 100% 100%;
    }
  }
}
.waterfall-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.waterfall-container .waterfall-item {
  border: 2px solid #fff !important;
  position: absolute;
  margin-bottom: 22px;
}
</style>
