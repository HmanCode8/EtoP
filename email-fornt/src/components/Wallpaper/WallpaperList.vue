<script setup lang="ts">
import { ref, watch, inject, computed, nextTick } from 'vue'
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
const page = ref<any>(1)
const pageSize = ref(20)
const lazyImg = ref<HTMLImageElement>(null as any)
const categoryId = ref<string>('')
const dialogVisible = ref(false)
const imgDetail = ref<PixabayImage>({} as PixabayImage)

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
  } catch (error) {}
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
const ondialogVisible = (data: PixabayImage) => {
  imgDetail.value = data
  dialogVisible.value = true
}

const handleCategoryClick = (cateId: string) => {
  if (page.value !== 1) {
    page.value = 1
    return
  }
  categoryId.value = cateId
}

const onNextPage = (number:number) => {
  page.value += number
}

// 添加一个Intersection Observer
const lazyLoadImages = (selecter: string = '.lazy-load') => {
  const options = {
    threshold: 0,
    root: document.querySelector('.wallpaper-list'),
  }
  const imgs = document.querySelectorAll(selecter)
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        // gsap.fromTo('.wallpaper-item', { opacity: 0, x: 200 }, { opacity: 1, x: 0, duration: 3, ease: 'bounce' })
        observer.unobserve(img)
      }
    })
  }, options)

  imgs.forEach((image) => {
    observer.observe(image)
  })
}
// 在组件挂载后调用懒加载函数
watch(wallpaperList, () => {
  setTimeout(() => {
    lazyLoadImages()
  }, 0)
})

const puts = computed(() => {
  return {
    pageTotal: Math.ceil(wallpaperTotal.value / pageSize.value),
    images: wallpaperList.value.map((w) => ({defaultUrl: w.webformatURL, url: w.largeImageURL})),
  }
})

</script>

<template>
  <div class="mb-5 w-full email-car-bg-color">
    <div class="wallpaper-h h-10 border-b"></div>
    <Category @onCategoryClick="handleCategoryClick" />
  </div>
  <ImageViewer @onClose="() => (dialogVisible = false)" @nextPage="onNextPage" v-if="dialogVisible" :url="imgDetail.largeImageURL" :images="puts.images" />
  <div v-if="wallpaperList.length > 0" class="wallpaper-list relative flex flex-wrap mt-5">
    <div
      :class="`wallpaper-${index % 3 === 0 ? 'item' : 'item-reverse'} group bg-white relative hover:cursor-pointer rounded-lg hover:shadow-lg`"
      href=""
      v-for="(w, index) in wallpaperList"
      :key="w.id"
    >
      <img ref="lazyImg" class="lazy-load w-full h-full rounded-lg" :data-src="w.webformatURL" :src="defaultUrl" alt="" />

      <div
        @click="ondialogVisible(w)"
        class="w-full h-ful bg-gradient-to-br rounded-lg from-[#000] to-[#3d403e] absolute z-10 top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-0 group-hover:opacity-70 group-hover:transition-opacity duration-300"
      >
        <img class="w-1/3 h-1/3" :src="base64" alt="" srcset="" />
      </div>
    </div>
  </div>
  <div class="mt-5 email-car-bg-color h-40 flex justify-center items-center rounded-lg p-5" v-else>暂无数据</div>
  <Panination :currentPage="page" :pageTotal="puts.pageTotal" @pageChange="(p) => (page = p)" />
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
</style>
