import { el } from "element-plus/es/locales.mjs";
import { ref } from "vue";

//持久化存储主题
const theme = localStorage.getItem("theme") || "light";
if (navigator.userAgent.includes("Chrome")) {
  document.startViewTransition(() => {
    document.documentElement.dataset.theme = theme;
  });
} else {
  document.documentElement.dataset.theme = theme;
}

// document.documentElement.setAttribute("data-theme", theme);

// 切换主题
const toggleTheme = (status = false) => {
  const newTheme = status ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  console.log("主题");
  debugger;
  if (navigator.userAgent.includes("Chrome")) {
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
    theme.value = newTheme;
  } else {
    document.documentElement.dataset.theme = newTheme;
    document.documentElement.style.transition = "background-color 0.5s ease"; // 添加过渡效果
    theme.value = newTheme;
  }
};

export default function useTheme() {
  const currentTheme = ref(theme);
  return {
    currentTheme,
    toggleTheme,
  };
}
