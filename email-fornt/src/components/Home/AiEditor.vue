<script setup lang="ts">
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";
import { onMounted, onUnmounted, ref } from "vue";
import { saveArticle, getArticleList } from "@/services/article";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const divRef = ref();
let aiEditor: AiEditor | null = null;
const title = ref("");
const editContent = ref("<strong>Hello</strong> <em>world</em>");
const isPreview = ref(false);

const highlight = (code: string) => {
  const result = hljs.highlightAuto(code).value;
  return hljs.highlightAuto(code).value;
};

const getArticle = async () => {
  try {
    const res = await getArticleList();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
getArticle();
const save = async () => {
  const res = await saveArticle({
    title: title.value,
    content: editContent.value,
  });
  console.log(res);
  //   console.log("save", title.value, editContent.value);
};

const preview = () => {
  isPreview.value = !isPreview.value;
  console.log("preview");
};

const publish = () => {
  console.log("publish");
};

onMounted(() => {
  console.log("onMounted");
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    placeholder: "点击输入内容...",
    content: "",
    theme: "light",
    onChange: (content: any) => {
      editContent.value = content.getHtml();
    },
    ai: {
      models: {
        spark: {
          appId: "bb26f2f2",
          apiKey: "18cfb88ba62c8fa308569221f1e2de6f",
          apiSecret: "ZGJkZWYxMGUyYjQ3YmE1Zjk2NWRlN2Rh",
          version: "v3.5",
        },
        bubblePanelEnable: true,
        bubblePanelModel: "spark",
        onCreateClientUrl: "....",
      },
    },
  });
});

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
});
</script>

<template>
  <div class="header bg-white mb-2 p-2 flex justify-between items-center">
    <div class="title">
      <input
        class="text-2xl font-bold"
        type="text"
        v-model="title"
        placeholder="请输入标题"
      />
    </div>
    <div class="btn-group">
      <el-button class="btn btn-primary" @click="save">保存</el-button>
      <el-button class="btn btn-secondary" @click="preview">预览</el-button>
      <el-button class="btn btn-secondary" @click="publish">发布</el-button>
    </div>
  </div>
  <div
    v-show="!isPreview"
    class="shadow-lg rounded-sm"
    ref="divRef"
    style="height: 600px"
  />
  <div
    v-show="isPreview"
    class="preview-box"
    style="height: 600px; overflow: auto"
    v-html="editContent"
  ></div>
</template>

<style></style>
