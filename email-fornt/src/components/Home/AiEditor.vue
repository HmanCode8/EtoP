<script setup lang="ts">
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";
import { onMounted, onUnmounted, reactive, ref, toRef } from "vue";

const divRef = ref();
let aiEditor: AiEditor | null = null;
const editContent = ref("");

const theme = toRef(localStorage.getItem("theme") || "dark");
onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    placeholder: "点击输入内容...",
    content: "",
    theme: "light",
    onChange: (content) => {
      console.log("content", content.getHtml());
      console.log("content", content.getHtml());
      editContent.value = content.getHtml();
    },
    // ai: {
    //   models: {
    //     wenxin: {
    //       access_token:
    //         "24.400ad24729abdff2032afbaeaaf0d6ad.2592000.1719282455.282335-74937161",
    //       protocol: "ws",
    //       version: "v3.5",
    //     },
    //   },
    // },
  });
});

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
});
</script>

<template>
  <div class="editor-box flex">
    <!-- <div
      v-html="editContent"
      class="bg-white shadow-lg rounded-sm w-1/2 flex flex-col"
    ></div> -->
    <div
      class="shadow-lg rounded-sm ml-auto"
      ref="divRef"
      style="height: 600px"
    />
  </div>
</template>

<style></style>
