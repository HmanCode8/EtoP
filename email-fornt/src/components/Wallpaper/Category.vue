<script setup lang="ts">
import { ref, watch, inject, nextTick } from 'vue'
import { Category } from '@/interfaces/wallpaper'
import { getWallpaperCategory, insertwallpapercategory } from '@/services/wallpaperService'
import { ElMessageBox } from 'element-plus'
const gsap: any = inject('gsap')
const categorys = ref<Category[]>([])
const cateActive = ref<string>('')

const emits = defineEmits(['onCategoryClick'])
const handleGetWallpaperCategory = async () => {
  try {
    const res = await getWallpaperCategory()
    if (res.code === 200) {
      if (res.data.length === 0) {
        updateApis()
      }
      categorys.value = res.data
    }
  } catch (error) {}
}
handleGetWallpaperCategory()

const updateApis = () => {
  ElMessageBox.alert('接口更新通知', {
    confirmButtonText: 'OK',
    callback: async () => {
      try {
        const res = await insertwallpapercategory()
        if (res.code === 200) {
          handleGetWallpaperCategory()
        }
      } catch (error) {
        console.log(error)
      }
    },
  })
}

const onCategory = (key: string) => {
  cateActive.value = key
}

watch([cateActive], () => {
  emits('onCategoryClick', cateActive.value)
})

watch(categorys, () => {
  nextTick(() => {
    gsap.fromTo('.cate-item', { opacity: 0, x: 200 }, { opacity: 1, x: 0, duration: 3, ease: 'bounce' })
    gsap.fromTo('.cate-item-reverse', { opacity: 0, y: 200 }, { opacity: 1, y: 0, duration: 3, ease: 'back' })
  })
})
</script>

<template>
  <div class="cate-list flex flex-wrap mt-5">
    <div
      :class="[`${index % 3 === 0 ? 'cate-item' : 'cate-item-reverse'} email-wallpaper-bg hover:cursor-pointer text-sm text-center rounded-2xl`, { active: cateActive === c.cate_key }]"
      v-for="(c, index) in categorys"
      :data-id="c.cate_key"
      @click="onCategory(c.cate_key)"
      :key="c.cate_key"
    >
      {{ c.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.cate-list {
  --theme: #9999ff;
  .cate-item, .cate-item-reverse {
    --n: 8;
    --w: 100px;
    --s: calc((100% - 100px * var(--n)) / var(--n) / 2);
    margin: 10px var(--s);
    width: 100px;
    // user-select: none;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    // overflow: hidden;
 
    &.active {
      color: #fff;
      background-color: var(--theme);
    }
  }
}
</style>
