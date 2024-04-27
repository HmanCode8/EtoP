import { onMounted, onUnmounted, ref } from "vue";

export function useLazyLoad(selector = ".lazy-load") {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || "";
          obs.unobserve(img);
        }
      });
    },
    { threshold: 0 }
  );

  const lazyImages = ref(null);

  onMounted(() => {
    lazyImages.value = document.querySelectorAll(selector);
    lazyImages.value.forEach((img) => observer.observe(img));
  });

  onUnmounted(() => {
    if (observer) {
      lazyImages.value?.forEach((img) => observer.unobserve(img));
      observer.disconnect();
    }
  });

  return { lazyImages };
}
