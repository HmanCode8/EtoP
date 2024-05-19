<script setup lang="ts">
import { ossUploads } from "@/services/bigFileUpload";
import { ref, defineProps, reactive } from "vue";

const showTableData = reactive({ data: [] });
const getoOssUploads = async () => {
  const res = await ossUploads();
  console.log(res);
  showTableData.data = res.data.objects;
};
getoOssUploads();
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
  <div class="h-96">
    <el-carousel autoplay>
      <el-carousel-item v-for="item in showTableData.data" :key="item">
        <img
          class="object-cover w-full h-full"
          :src="item.url"
          alt=""
          srcset=""
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped lang="scss"></style>
