<script setup lang="ts">
import { ref, watch } from "vue";
import { Category } from "@/interfaces/wallpaper";
import {
  getWallpaperCategory,
  insertwallpapercategory,
} from "@/services/wallpaperService";
import { ElMessageBox } from "element-plus";

const categorys = ref<Category[]>([]);
const cateActive = ref<string>("");

const emits = defineEmits(["onCategoryClick"]);
const handleGetWallpaperCategory = async () => {
  try {
    const res = await getWallpaperCategory();
    if (res.code === 200) {
      if (res.data.length === 0) {
        updateApis();
      }
      categorys.value = res.data;
    }
  } catch (error) {}
};
handleGetWallpaperCategory();

const updateApis = () => {
  ElMessageBox.alert("接口更新通知", {
    confirmButtonText: "OK",
    callback: async () => {
      try {
        const res = await insertwallpapercategory();
        if (res.code === 200) {
          handleGetWallpaperCategory();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
};

const onCategory = (key: string) => {
  cateActive.value = key;
};

watch([cateActive], () => {
  emits("onCategoryClick", cateActive.value);
});
</script>

<template>
  <div class="cate-list flex flex-wrap mt-5 w-full">
    <div
      :class="[
        'cate-item email-wallpaper-bg hover:cursor-pointer text-sm text-center rounded-2xl',
        { active: cateActive === wallpaper.cate_key },
      ]"
      v-for="wallpaper in categorys"
      :data-id="wallpaper.cate_key"
      @click="onCategory(wallpaper.cate_key)"
      :key="wallpaper.cate_key"
    >
      {{ wallpaper.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.cate-list {
  --theme: #9999ff;
  .cate-item {
    --n: 8;
    --w: 100px;
    --s: calc((100% - 100px * var(--n)) / var(--n) / 2);
    margin: 10px var(--s);
    width: 100px;
    transition: all 0.3s;
    // user-select: none;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    // overflow: hidden;
    &:hover {
      transform: scale(1.1);
      // background: var(--theme);
      // box-shadow: 3px 5px 5px rgba(33, 32, 32, 0.1);
    }
    &.active {
      color: #fff;
      background-color: var(--theme);
    }
  }
}
</style>
