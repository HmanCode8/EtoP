<script setup lang="ts">
import { ref, defineProps, reactive } from "vue";

const carousel = [
  {
    imgUrl:
      " https://img.yzcdn.cn/public_files/2021/08/17/f77d9d9d0d9d4d0d1d9d9d9d9d9d9d9d.jpg",
    title: "title1",
    desc: "desc1",
  },
  {
    imgUrl:
      " https://img.yzcdn.cn/public_files/2021/08/17/f77d9d9d0d9d4d0d1d9d9d9d9d9d9d9d.jpg",
    title: "title2",
    desc: "desc2",
  },
  {
    imgUrl:
      " https://img.yzcdn.cn/public_files/2021/08/17/f77d9d9d0d9d4d0d1d9d9d9d9d9d9d9d.jpg",
    title: "title3",
    desc: "desc3",
  },
  {
    imgUrl:
      " https://img.yzcdn.cn/public_files/2021/08/17/f77d9d9d0d9d4d0d1d9d9d9d9d9d9d9d.jpg",
    title: "title4",
    desc: "desc4",
  },
];
const carouselList = reactive({ data: carousel });

// 使用 ref 创建响应式数据
const count = ref(0);
count.value++; // 修改 count 的值
</script>

<template>
  <div class="carousel-list h-96 w-full relative">
    <div class="pre absolute left-0 top-10"><</div>
    <div class="next absolute right-0 top-0">></div>
    <div
      class="carousel-item border w-full h-full bg-slate-500 absolute"
      v-for="(item, index) in carouselList.data"
      :key="index"
    >
      <div class="carousel-item-content">
        <h2>{{ item.title }}</h2>
        <p>{{ item.desc }}</p>
      </div>
      <img :src="item.imgUrl" alt="" srcset="" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
