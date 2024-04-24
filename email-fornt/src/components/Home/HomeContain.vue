<script setup lang="ts">
import { ref, defineProps } from "vue";

interface Message {
  title: string;
  data: string[];
  time: string;
  banner: string;
}
const newMessags = ref<Message>({ title: "", data: [], time: "", banner: "" });

const getNew = async () => {
  const res = await fetch("https://api.vvhan.com/api/60s");
  const data = await res.json();
  console.log("data===", data);
  newMessags.value = data;
};
getNew();
</script>

<template>
  <div>
    <h2 class="title font-bold flex items-center justify-center m-10 text-lg">
      {{ newMessags.title }}
    </h2>
    <div class="article">
      <!-- float-left -->
      <img class="w-1/3 mr-5 ml-5" :src="newMessags.banner" alt="" />
      <p class="m-5" v-for="(item, index) in newMessags.data" :key="index">
        {{ item }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
