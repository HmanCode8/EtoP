import { ref } from "vue";

//持久化存储主题
const theme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", theme);

// 切换主题
const toggleTheme = (status = false) => {
  const newTheme = status ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
  theme.value = newTheme;
};

export default function useTheme() {
  const currentTheme = ref(theme);
  return {
    currentTheme,
    toggleTheme,
  };
}
