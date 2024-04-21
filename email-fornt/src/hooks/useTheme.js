import { ref } from "vue";

//持久化存储主题
const theme = localStorage.getItem("theme") || "light";
document.startViewTransition(() => {
  document.documentElement.dataset.theme = theme;
});
// document.documentElement.setAttribute("data-theme", theme);

// 切换主题
const toggleTheme = (status = false) => {
  const newTheme = status ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  // document.documentElement.setAttribute("data-theme", newTheme);
  const transition = document.startViewTransition((e) => {
    document.documentElement.dataset.theme = newTheme;
  });
  // const x = e.clientX;
  // const y = e.clientY;
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
};

export default function useTheme() {
  const currentTheme = ref(theme);
  return {
    currentTheme,
    toggleTheme,
  };
}
