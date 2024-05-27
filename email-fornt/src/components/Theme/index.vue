<script setup>
//引入主题hook
import { ref, watchEffect } from 'vue'
import { useUserStore } from "@/store";

const userStore = useUserStore()

const chromeTheme = () => {
  const transition = document.startViewTransition((e) => {
    document.documentElement.dataset.theme =  userStore.theme;
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: ["circle(0% at 50% 50%)", "circle(100% at 50% 50%)"],
      },
      {
        duration: 1000,
        // easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
};
const ortherTheme = () => {
  document.documentElement.dataset.theme =  userStore.theme;
  document.documentElement.style.transition = "background-color 0.5s ease"; // 添加过渡效果
};

// 切换主题
const toggleTheme = () => {
  localStorage.setItem("theme", userStore.theme);
  userStore.toggleTheme(userStore.theme === "dark" ? "light" : "dark")
  if (navigator.userAgent.includes("Chrome")) {
    chromeTheme();
  } else {
    ortherTheme();
  }
};

</script>

<template>
  <div @click="toggleTheme" class="email-theme-color hover:cursor-pointer w-10 h-10 text-center rounded-full flex justify-center items-center fixed bottom-10 right-10 shadow-2xl z-10">
    <svg v-if="userStore.theme === 'dark'" class="icon-2 active" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path
        d="M234.24 512a277.76 277.76 0 1 0 555.52 0 277.76 277.76 0 1 0-555.52 0zM512 187.733a42.667 42.667 0 0 1-42.667-42.666v-102.4a42.667 42.667 0 0 1 85.334 0v102.826A42.667 42.667 0 0 1 512 187.733zm-258.987 107.52a42.667 42.667 0 0 1-29.866-12.373l-72.96-73.387a42.667 42.667 0 0 1 59.306-59.306l73.387 72.96a42.667 42.667 0 0 1 0 59.733 42.667 42.667 0 0 1-29.867 12.373zm-107.52 259.414H42.667a42.667 42.667 0 0 1 0-85.334h102.826a42.667 42.667 0 0 1 0 85.334zm34.134 331.946a42.667 42.667 0 0 1-29.44-72.106l72.96-73.387a42.667 42.667 0 0 1 59.733 59.733l-73.387 73.387a42.667 42.667 0 0 1-29.866 12.373zM512 1024a42.667 42.667 0 0 1-42.667-42.667V878.507a42.667 42.667 0 0 1 85.334 0v102.826A42.667 42.667 0 0 1 512 1024zm332.373-137.387a42.667 42.667 0 0 1-29.866-12.373l-73.387-73.387a42.667 42.667 0 0 1 0-59.733 42.667 42.667 0 0 1 59.733 0l72.96 73.387a42.667 42.667 0 0 1-29.44 72.106zm136.96-331.946H878.507a42.667 42.667 0 1 1 0-85.334h102.826a42.667 42.667 0 0 1 0 85.334zM770.987 295.253a42.667 42.667 0 0 1-29.867-12.373 42.667 42.667 0 0 1 0-59.733l73.387-72.96a42.667 42.667 0 1 1 59.306 59.306l-72.96 73.387a42.667 42.667 0 0 1-29.866 12.373z"
      ></path>
    </svg>

    <svg v-else class="icon-1 active" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path
        d="M587.264 104.96c33.28 57.856 52.224 124.928 52.224 196.608 0 218.112-176.128 394.752-393.728 394.752-29.696 0-58.368-3.584-86.528-9.728C223.744 832.512 369.152 934.4 538.624 934.4c229.376 0 414.72-186.368 414.72-416.256 1.024-212.992-159.744-389.12-366.08-413.184z"
      ></path>
      <path
        d="M340.48 567.808l-23.552-70.144-70.144-23.552 70.144-23.552 23.552-70.144 23.552 70.144 70.144 23.552-70.144 23.552-23.552 70.144zM168.96 361.472l-30.208-91.136-91.648-30.208 91.136-30.208 30.72-91.648 30.208 91.136 91.136 30.208-91.136 30.208-30.208 91.648z"
      ></path>
    </svg>
  </div>
</template>

<style scoped>
.email-theme-color {
  background-color: aqua;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 20px rgba(0, 0, 0, 0.2);
}
</style>
