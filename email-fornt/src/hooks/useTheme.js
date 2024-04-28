import { el } from "element-plus/es/locales.mjs";
import { ref } from "vue";
const starts = document.querySelectorAll(".start");

//持久化存储主题
const theme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = theme;

const chromeTheme = (newTheme) => {
  const transition = document.startViewTransition((e) => {
    document.documentElement.dataset.theme = newTheme;
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
const ortherTheme = (newTheme) => {
  document.documentElement.dataset.theme = newTheme;
  document.documentElement.style.transition = "background-color 0.5s ease"; // 添加过渡效果
};

// 切换主题
const toggleTheme = (status = false) => {
  const newTheme = status ? "dark" : "light";
  // if (newTheme === "light") {
  //   starts.forEach((item) => {
  //     item.style.display = "none";
  //   });
  // } else {
  //   starts.forEach((item) => {
  //     item.style.display = "block";
  //   });
  // }
  localStorage.setItem("theme", newTheme);
  if (navigator.userAgent.includes("Chrome")) {
    chromeTheme(newTheme);
  } else {
    ortherTheme(newTheme);
  }
  theme.value = newTheme;
};

const fn = () => {};
export default function useTheme() {
  const currentTheme = ref(theme);
  return {
    currentTheme,
    toggleTheme,
  };
}
