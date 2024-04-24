<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import AvatarUpload from "@/components/Upload/AvatarUpload.vue";

import moment from "moment";

const getResultTime = (key) => {
  let result;
  if (key === "hour") {
    result = moment().format("HH");
  }
  if (key === "week") {
    // debugger;
    result = moment().day();
  }
  if (key === "month") {
    result = moment().date();
  }
  if (key === "year") {
    result = moment().format("M");
  }
  return result;
};

/**
 * 100% 75%
 * 3
 */
const PROCESS = [
  {
    title: `今天已经过去了p${getResultTime("hour")}p小时`,
    processPercent: Math.ceil((getResultTime("hour") / 24) * 100),
    bgColor: "#bde6ff",
    bgImgColor: "#50bfff",
  },
  {
    title: `本周已经过去了p${getResultTime("week")}p天`,
    processPercent: Math.ceil((getResultTime("week") / 7) * 100),
    bgColor: "#f9da8c",
    bgImgColor: "#eebc4c",
  },
  {
    title: `这月已经过去了p${getResultTime("month")}p天`,
    processPercent: Math.ceil((getResultTime("month") / 30) * 100),
    bgColor: "#f3adab",
    bgImgColor: "#eb5851",
  },
  {
    title: `今年已经过去了p${getResultTime("year")}p个月`,
    processPercent: Math.ceil((getResultTime("year") / 12) * 100),
    bgColor: "#7ec050",
    bgImgColor: "#639c3c",
  },
];

const processList = reactive(PROCESS);

const puts = computed(() => {
  return {
    splitLife: (title) => title.split("p"),
  };
});
const userInfo = reactive(JSON.parse(sessionStorage.getItem("userInfo")));
</script>

<template>
  <div
    class="car-item email-car-bg-color relative rounded-lg flex flex-col items-center"
  >
    <div class="bg w-full h-30">
      <img
        class="h-full rounded-lg w-full object-cover"
        src="https://www.vvhan.com/static/newstyle.gif"
        alt=""
        srcset=""
      />
    </div>
    <div class="avatar w-full rounded-lg flex justify-center absolute bottom-7">
      <AvatarUpload :userInfo="userInfo" />
    </div>
    <div class="email-username font-bold text-center text-lg">
      {{ userInfo.username }}
    </div>
    <!-- <div class="remark">{{ userInfo.email }}</div> -->
  </div>
  <div
    class="car-item email-car-bg-color mt-5 pl-5 pr-5 flex rounded-lg flex-col w-full"
  >
    <div class="h pt-4 border-b-[#000]">人生倒计时</div>
    <div
      class="process-item flex flex-col mt-3"
      v-for="p in processList"
      :key="p.title"
    >
      <div class="process-name text-sm">
        {{ puts.splitLife(p.title)[0]
        }}<span class="text-lg text-[#9999ff]">{{
          puts.splitLife(p.title)[1]
        }}</span
        >{{ puts.splitLife(p.title)[2] }}
      </div>
      <div class="flex justify-between items-center w-full">
        <div class="process-bar bg-slate-300 h-2 w-5/6 rounded-lg">
          <div
            class="progress-bar-inner"
            :style="`width: ${p.processPercent}% ; background-color: ${p.bgColor} ;background-image: linear-gradient(135deg,${p.bgImgColor} 25%,transparent 25%,transparent 50%,${p.bgImgColor} 50%,${p.bgImgColor} 75%,transparent 75%,transparent 100%)`"
          ></div>
        </div>
        <div class="process-text m-auto">{{ p.processPercent }}%</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  background: linear-gradient(to bottom, transparent, white);
}
@keyframes progress {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 30px 0;
  }
}
.progress-bar-inner {
  background-size: 30px 30px;
  height: 100%;
  border-radius: 5px;
  transition: width 0.35s;
  animation: progress 750ms linear infinite;
}
</style>
