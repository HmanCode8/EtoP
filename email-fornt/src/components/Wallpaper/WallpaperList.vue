<script setup lang="ts">
import { ref, watch } from "vue";
import defaultUrl from "@/assets/loading.gif";
import {
  getWallpaperCategory,
  insertwallpapercategory,
  getWallpaper,
} from "@/services/wallpaperService";
import { Category, PixabayImage } from "@/interfaces/wallpaper";
import _ from "lodash";
import { ElMessageBox } from "element-plus";

const SOURCE_PREFIX = "heshiheng";
const TARGET_PREFIX = "pixabay";
const base64 =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSIgdmlld0JveD0iMCAwIDQ1IDQ1IiBzdHJva2U9IiNmZmYiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSAxKSIgc3Ryb2tlLXdpZHRoPSIyIj48Y2lyY2xlIGN4PSIyMiIgY3k9IjIyIiByPSI2IiBzdHJva2Utb3BhY2l0eT0iMCI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgYmVnaW49IjEuNXMiIGR1cj0iM3MiIHZhbHVlcz0iNjsyMiIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIgYmVnaW49IjEuNXMiIGR1cj0iM3MiIHZhbHVlcz0iMTswIiBjYWxjTW9kZT0ibGluZWFyIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS13aWR0aCIgYmVnaW49IjEuNXMiIGR1cj0iM3MiIHZhbHVlcz0iMjswIiBjYWxjTW9kZT0ibGluZWFyIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIyIiBjeT0iMjIiIHI9IjYiIHN0cm9rZS1vcGFjaXR5PSIwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiBiZWdpbj0iM3MiIGR1cj0iM3MiIHZhbHVlcz0iNjsyMiIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIgYmVnaW49IjNzIiBkdXI9IjNzIiB2YWx1ZXM9IjE7MCIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utd2lkdGgiIGJlZ2luPSIzcyIgZHVyPSIzcyIgdmFsdWVzPSIyOzAiIGNhbGNNb2RlPSJsaW5lYXIiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMjIiIGN5PSIyMiIgcj0iOCI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgYmVnaW49IjBzIiBkdXI9IjEuNXMiIHZhbHVlcz0iNjsxOzI7Mzs0OzU7NiIgY2FsY01vZGU9ImxpbmVhciIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L2NpcmNsZT48L2c+PC9zdmc+";
let wallpaperHeaders = ref<Category[]>([]);
let wallpaperList = ref<PixabayImage[]>([]);
const wallpaperTotal = ref(0);
const cateActive = ref<string>("");
const page = ref(1);
const pageSize = ref(64);
const dialogVisible = ref(false);
const imgDetail = ref<PixabayImage>({} as PixabayImage);

const handleGetWallpaperCategory = async () => {
  try {
    const res = await getWallpaperCategory();
    if (res.code === 200) {
      if (res.data.length === 0) {
        updateApis();
      }
      wallpaperHeaders.value = res.data;
      handleWallpaperList(res.data[0].id);
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

const handleWallpaperList = async (category?: string) => {
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      // photoVal: "黄色​​花",
      imgType: "photo",
      category: category || "all",
    };
    const res = await getWallpaper(params);
    if (res.code === 200) {
      const data = res.data.hits.map((item: any) =>
        _.mapValues(item, (value: string) =>
          _.includes(value, SOURCE_PREFIX)
            ? value.replace(SOURCE_PREFIX, TARGET_PREFIX)
            : value
        )
      );
      wallpaperList.value = data;
      wallpaperTotal.value = res.data.totalHits;
    }
  } catch (error) {}
};

const onCategory = (key: string) => {
  cateActive.value = key;
  handleWallpaperList(key);
};

const onPageChange = (page: number) => {
  console.log(page);
};
const ondialogVisible = (data: PixabayImage) => {
  imgDetail.value = data;
  dialogVisible.value = true;
};

// 添加一个Intersection Observer
const lazyLoadImages = () => {
  const options = {
    threshold: 0,
  };
  const imgs = document.querySelectorAll(".lazy-load");
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || "";
        observer.unobserve(img);
      }
    });
  }, options);

  imgs.forEach((image) => {
    observer.observe(image);
  });
};
// 在组件挂载后调用懒加载函数
watch(wallpaperList, () => {
  setTimeout(() => {
    lazyLoadImages();
  }, 0);
});
</script>

<template>
  <div class="mb-5">
    <div class="wallpaper-h h-20 border-b"></div>
    <div class="cate-list flex flex-wrap mt-5 w-full">
      <div
        :class="[
          'cate-item email-wallpaper-bg hover:cursor-pointer text-sm text-center rounded-2xl',
          { active: cateActive === wallpaper.cate_key },
        ]"
        v-for="wallpaper in wallpaperHeaders"
        :data-id="wallpaper.cate_key"
        @click="onCategory(wallpaper.cate_key)"
        :key="wallpaper.cate_key"
      >
        {{ wallpaper.name }}
      </div>
    </div>
  </div>
  <!-- <div class="">dadad</div> -->
  <div class="wallpaper-list flex flex-wrap mt-5 w-full">
    <div
      class="wallpaper-item group relative hover:cursor-pointer rounded-lg hover:shadow-lg"
      href=""
      v-for="w in wallpaperList"
      :key="w.id"
    >
      <img
        class="lazy-load w-full h-full rounded-lg"
        :data-src="w.webformatURL"
        :src="defaultUrl"
        alt=""
      />
      <div
        @click="ondialogVisible(w)"
        class="w-full h-ful bg-gradient-to-br rounded-lg from-[#000] to-[#3d403e] absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-0 group-hover:opacity-70 group-hover:transition-opacity duration-300"
      >
        <img class="w-1/3 h-1/3" :src="base64" alt="" srcset="" />
      </div>
    </div>
  </div>
  <!-- 分页组件 -->
  <div class="pagination flex text-sm justify-end items-center">
    <!-- <div>共有/{{ wallpaperTotal }}</div> -->

    <div
      class="frist-page m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white"
    >
      首页
    </div>
    <div
      class="pre m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white"
    >
      &lt;
    </div>
    <div class="page-list flex">
      <div
        class="page m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white"
        v-for="i in 3"
        @click="onPageChange(i)"
        :key="i"
      >
        {{ i }}
      </div>
    </div>
    <div
      class="next m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white"
    >
      &gt;
    </div>
    <div
      class="last-page m-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] p-2 bg-white"
    >
      末页
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="图片详情" width="80%" draggable>
    <div class="flex">
      <img
        class="w-2/3 border-2 border-gray-200 rounded-lg"
        :src="imgDetail.largeImageURL"
        alt=""
        srcset=""
      />
      <div class="detail mr-auto ml-4 leading-8">
        <div class="flex justify-between items-center mb-2">
          作者：<img
            :src="imgDetail.userImageURL"
            class="w-10 h-10 rounded-full"
            alt=""
          />
          <div class="ml-2">{{ imgDetail.user }}</div>
        </div>

        <div>下载量：{{ imgDetail.downloads }}次</div>
        <div>收藏量：{{ imgDetail.likes }}次</div>
        <div>评论量：{{ imgDetail.comments }}</div>
        <div>尺寸：{{ imgDetail.imageWidth }}x{{ imgDetail.imageHeight }}</div>
        <div>
          大小：{{ (Number(imgDetail.imageSize) / 1024 / 1024).toFixed(2) }}MB
        </div>
        <div>类型：{{ imgDetail.type }}</div>
        <div>收藏：{{ imgDetail.collections }} 次</div>
        <div>查看：{{ imgDetail.views }} 次</div>
      </div>
    </div>
  </el-dialog>
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
.wallpaper-list {
  --theme: #9999ff;
  .wallpaper-item {
    --n: 3;
    --w: 300px;
    --h: 200px;
    --s: calc((100% - var(--w) * var(--n)) / var(--n) / 2);
    margin: 10px var(--s);
    width: var(--w);
    height: var(--h);
    transform: translateY(-2px);
    // background: var(--theme);
    box-shadow: 3px 5px 5px rgba(33, 32, 32, 0.1);
    // &.active {
    //   transform: translateY(-2px);
    //   background: var(--theme);
    //   box-shadow: 3px 5px 5px rgba(33, 32, 32, 0.1);
    // }
    img {
      background-size: 100% 100%;
    }
  }
}
.pagination {
  div {
    min-width: 40px;
    text-align: center;
  }
}
</style>
