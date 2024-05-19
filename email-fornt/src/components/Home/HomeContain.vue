<script setup lang="ts">
import { ref, inject, watch, nextTick, onMounted } from "vue";
import { getApisCateNews } from "@/services/homeService";
import Carousel from "@/components/Home/Carousel.vue";
import _ from "lodash";
interface Message {
  title: string;
  data: string[];
  time: string;
  banner: string;
}

const newSixRef = ref(null);
const weatherRef = ref(null);
const englishRef = ref(null);
const sixNews = ref<Message>({ title: "", data: [], time: "", banner: "" });
const weatherImg = ref("");
const english = ref("");
const gsap: any = inject("gsap");
const handleGetNews = async () => {
  try {
    let result = [];
    const {
      data: { sixNews: six },
    } = await getApisCateNews({
      new_keys: ["sixNews"],
    });
    result = six;
    if (_.isEmpty(result)) {
      const res = await fetch("https://api.vvhan.com/api/60s");
      result = await res.json();
    }
    sixNews.value = result;
  } catch (error) {
    console.log(error);
  }
};

const handleGetWeather = async () => {
  try {
    const res = await fetch("https://api.vvhan.com/api/ipCard");

    // 返回的是一张图片
    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);
    weatherImg.value = imageUrl; // 图片地址
    // weatherImg.value = result.weatherImg
  } catch (error) {}
};
const OneDayEnglish = async () => {
  try {
    const res = await fetch("https://api.oioweb.cn/api/common/OneDayEnglish");
    const { result } = await res.json();
    english.value = result;
    // weatherImg.value = result.weatherImg
  } catch (error) {}
};
handleGetNews();
handleGetWeather();
OneDayEnglish();

watch(sixNews, () => {
  gsap.fromTo(
    newSixRef.value,
    { opacity: 0, x: -200 },
    { opacity: 1, x: 0, duration: 3, ease: "elastic" }
  );
});

watch(weatherImg, () => {
  gsap.fromTo(
    weatherRef.value,
    { opacity: 0, y: 200 },
    { opacity: 1, y: 0, duration: 3, ease: "bounce" }
  );
});

watch(english, () => {
  gsap.fromTo(
    englishRef.value,
    { opacity: 0, y: 200 }, // 初始位置
    { opacity: 1, y: 0, duration: 3, ease: "bounce" } // 动画效果
  );
});
</script>

<template>
  <div class="p-2 flex">
    <div ref="newSixRef" class="homeReleft w-2/3">
      <h2 class="title mb-3 font-bold flex items-center text-lg">
        {{ sixNews.title }}
      </h2>
      <div class="article">
        <!-- float-left -->
        <img
          class="rounded-lg mr-3 mb-3 shadow-xl hover:scale-105 duration-300 h-60 float-left"
          :src="sixNews.banner"
          alt=""
        />
        <div>
          <p
            class="ml-5 text-sm"
            v-for="(item, index) in sixNews.data"
            :key="index"
          >
            {{ index + 1 }} : {{ item }}
          </p>
        </div>
      </div>
    </div>
    <div ref="weatherRef" class="flex flex-col ml-auto">
      <h2 class="title mb-3 font-bold flex items-center text-lg">每日天气</h2>
      <img
        class="rounded-lg shadow-xl hover:scale-105 duration-300"
        :src="weatherImg"
        alt=""
        srcset=""
      />
    </div>
  </div>
  <!-- <div class="p-2 my-5 flex justify-center items-center" v-else>暂无数据</div> -->
  <div class="flex items-center">
    <div ref="englishRef" class="w-1/3">
      <h2 class="title mb-3 font-bold flex items-center text-lg">每日英文</h2>
      <!-- <p>{{ english.content }}</p>
    <p>{{ english.note }}</p> -->
      <img
        class="h-full rounded-lg shadow-xl hover:scale-105 duration-300"
        :src="english.img"
        alt=""
        srcset=""
      />
    </div>
    <div class="mx-10 h-80 mr-auto w-1/2">
      <h2 class="title mb-3 font-bold flex items-center text-lg">每日英文</h2>
      <Carousel />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
