<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import AvatarUpload from "@/components/Upload/AvatarUpload.vue";
import { loginsum } from "@/services/userService";
import moment from "moment";
import _ from "lodash";

const getResultTime = (key: string) => {
  let result;
  if (key === "hour") {
    const h = moment().format("H");
    result =
      Number(h) === 0
        ? (Number(moment().format("mm")) / 60).toFixed(1)
        : moment().format("HH");
  }
  if (key === "week") {
    const w = moment().day();
    result = w === 0 ? 7 : w;
  }
  if (key === "month") {
    result = moment().date();
  }
  if (key === "year") {
    result = moment().format("M");
  }
  return Number(result);
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

const loginCount = ref<any>(0);
const processList = reactive(PROCESS);

const getLoginCount = async () => {
  try {
    const res = await loginsum();
    if (res.code === 200) {
      loginCount.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
getLoginCount();
const puts = computed(() => {
  return {
    splitLife: (title: string) => title.split("p"),
    loginSum: _.reduce(
      loginCount.value,
      (pre: number, cur: any) => {
        return pre + cur.count;
      },
      0
    ),
  };
});
const user = JSON.parse((sessionStorage as any).getItem("userInfo"));
const userInfo = reactive<any>(user);
</script>

<template>
  <div
    class="car-item email-car-bg-color pb-5 rounded-lg flex flex-col items-center"
  >
    <div class="bg w-full h-35 relative">
      <img
        class="h-full rounded-lg w-full object-cover"
        src="https://www.vvhan.com/static/newstyle.gif"
        alt=""
        srcset=""
      />
      <div class="avatar w-full h-1/3 flex justify-center absolute bottom-0">
        <AvatarUpload :userInfo="userInfo" action="preview" />
      </div>
    </div>

    <div class="email-username font-bold mt-5 text-center text-lg">
      {{ userInfo.username }}
    </div>

    <div class="signature text-center text-sm mt-5">运气是计划之外的东西</div>

    <div class="flex border-b pb-3 w-3/4 justify-between items-center mt-5">
      <div
        class="aticle-sum w-1/2 border-r flex flex-col items-center justify-center"
      >
        <div>{{ puts.loginSum }}</div>
        <div>近日访问量</div>
      </div>
      <div class="flex-grow flex flex-col items-center justify-center">
        <div>261</div>
        <div>总访问量</div>
      </div>
    </div>
    <!-- 个性签名 -->

    <!-- <div class="remark">{{ userInfo.email }}</div> -->
  </div>
  <div
    class="car-item email-car-bg-color mt-5 p-5 flex rounded-lg flex-col w-full"
  >
    <div class="h pb-4 border-b">人生倒计时</div>
    <div
      class="process-item flex flex-col"
      v-for="p in processList"
      :key="p.title"
    >
      <div class="process-name text-sm mt-3 text-[#999]">
        {{ puts.splitLife(p.title)[0]
        }}<span class="email-split-line"
          >&nbsp;{{ puts.splitLife(p.title)[1] }}&nbsp;</span
        >{{ puts.splitLife(p.title)[2] }}
      </div>
      <div class="flex justify-between text-sm items-center w-full">
        <div class="process-bar bg-slate-300 h-2 w-5/6 rounded-lg">
          <div
            class="progress-bar-inner"
            :style="`width: ${p.processPercent}% ; background-color: ${p.bgColor} ;background-image: linear-gradient(135deg,${p.bgImgColor} 25%,transparent 25%,transparent 50%,${p.bgImgColor} 50%,${p.bgImgColor} 75%,transparent 75%,transparent 100%)`"
          ></div>
        </div>
        <div class="process-text m-auto text-[#999]">
          {{ p.processPercent }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  background: linear-gradient(to bottom, transparent, white);
}
.avatar::after {
  content: "";
  position: absolute;
  top: 34px;
  left: 0;
  width: 100%;
  height: 30px;
  z-index: 2;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #232323);
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
