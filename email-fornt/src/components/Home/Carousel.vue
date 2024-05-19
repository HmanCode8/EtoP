<script setup lang="ts">
import { ref, defineProps } from "vue";

const slideTitle = ref("");
const props = defineProps({
  carouselList: {
    type: Array,
    required: true,
  },
});
const handleSlideChange = (index: number) => {
  console.log(index);
  slideTitle.value = props.carouselList[index].name;
};
</script>

<template>
  <el-carousel @change="handleSlideChange" type="card" autoplay>
    <el-carousel-item v-for="item in props.carouselList" :key="item">
      <!-- {{ item.name }} -->
      <img
        class="object-cover w-full h-full"
        :src="item.url"
        alt=""
        srcset=""
      />
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped lang="scss"></style>
