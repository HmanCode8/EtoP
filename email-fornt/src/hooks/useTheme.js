import { el } from "element-plus/es/locales.mjs";
import { ref } from "vue";
const starts = document.querySelectorAll(".start");

//持久化存储主题
let theme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = theme;
const currentTheme = ref(theme);

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
  console.log(status)
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
  currentTheme.value = newTheme;

  if (navigator.userAgent.includes("Chrome")) {
    chromeTheme(newTheme);
  } else {
    ortherTheme(newTheme);
  }
};

export  {
  currentTheme,
  toggleTheme,
}
