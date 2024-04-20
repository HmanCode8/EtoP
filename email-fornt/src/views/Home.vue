<script setup>
import { ref, onMounted, reactive, defineComponent } from "vue";
import CenterEchart from "../components/Home/centerEchart.vue";
import LeftEchart from "../components/Home/leftEchart.vue";
import LeftEchartBottom from "../components/Home/leftEchartBottom.vue";
import RightEchart from "../components/Home/rightEchart.vue";
import RightEchartBottom from "../components/Home/rightEchartBottom.vue";
import Mapchart from "../components/Home/mapEchart.vue";
import * as echarts from "echarts";

import VScaleScreen from "v-scale-screen";

defineComponent({
  VScaleScreen,
});
const frontendTechStack = reactive([
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Vue.js",
  "Angular",
  "TypeScript",
  "Sass",
  "Webpack",
  "Tailwind CSS",
]);
const title = ref("数据展示平台");
</script>

<template>
  <v-scale-screen width="1920" height="1080" :fullScreen="true">
    <div class="h-screen flex flex-col">
      <div class="flex text-white items-center justify-between">
        <div class="left lg:w-1/4 flex justify-around">
          <router-link class="hover:text-[#50c48f] hover:underline" to="/home"
            >首页</router-link
          >
          <router-link class="hover:text-[#50c48f] hover:underline" to="/email"
            >关于</router-link
          >
          <router-link class="hover:text-[#50c48f] hover:underline" to="/"
            >返回</router-link
          >
        </div>
        <div class="lg:w-2/4 flex justify-center center font-bold text-4xl">
          {{ title }}
        </div>
        <div class="lg:w-1/4 flex justify-center right">----</div>
      </div>

      <div class="flex-grow flex">
        <!-- 左侧 -->
        <div class="w-1/4">
          <div class="h-1/2 shadow-lg"><LeftEchart /></div>
          <div class="h-1/2"><LeftEchartBottom /></div>
        </div>

        <!-- 中间 -->
        <div class="w-1/2 flex flex-col">
          <div class="h-2/6"><CenterEchart /></div>
          <div class="flex-grow"><Mapchart /></div>
        </div>

        <!-- 右侧 -->
        <div class="w-1/4">
          <div class="h-1/2"><RightEchart /></div>
          <div class="h-1/2"><RightEchartBottom /></div>
        </div>
      </div>
    </div>
  </v-scale-screen>
</template>

<style scoped></style>
