<script setup>
import Quill from "quill";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "quill/dist/quill.snow.css";

import { ref, reactive, watch, nextTick } from "vue";

const editorContainer = ref("");
const fontSize = reactive([1, 2, 3, 4]);
const emailContent = ref("");
const emailContentBlock = ref("");
const code = ref("");
const highlightedCode = ref("");
const serderValue = ref("");
const themContet = ref("");
const senderOptions = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
// const menuActive = ref(prop.menuActive)
const emit = defineEmits(["sendEmail"]);

const props = defineProps({
  menuActive: {
    type: Number,
    default: 1,
  },
  users: {
    type: Array,
    default: () => [],
  },
});
const handleSendEmail = () => {
  const params = {
    content: emailContent.value,
    contentBlock: emailContentBlock.value,
    recipient: serderValue.value,
  };
  emit("sendEmail", params);
};

const editorOption = {
  placeholder: "请输入",
  theme: "snow",
  modules: {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
        ["blockquote", "code-block"], // 引用  代码块
        [{ header: 1 }, { header: 2 }], // 1、2 级标题
        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
        [{ script: "sub" }, { script: "super" }], // 上标/下标
        [{ indent: "-1" }, { indent: "+1" }], // 缩进
        // [{ direction: 'rtl' }], // 文本方向
        [
          {
            size: ["12", "14", "16", "18", "20", "22", "24", "28", "32", "36"],
          },
        ], // 字体大小
        [{ header: [1, 2, 3, 4, 5, 6] }], // 标题
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
        // [{ font: ['songti'] }], // 字体种类
        [{ align: [] }], // 对齐方式
        ["clean"], // 清除文本格式
        ["image"], // 链接、图片，需要视频的可以加上video
      ],
      handlers: {
        //此处是图片上传时候需要使用到的
        image: function (value) {
          console.log(value);
          if (value) {
            // 点击图片
            document.querySelector("#upload").click();
          }
        },
      },
    },
    imageDrop: true, // 图片拖拽
    imageResize: {
      // 图片放大缩小
      displayStyles: {
        backgroundColor: "black",
        border: "none",
        color: "white",
      },
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  },
};
let editor;
const editRoot = () => {
  editor = new Quill(editorContainer.value, editorOption);

  function highlightCode() {
    const highlighted = hljs.highlightAuto(code.value).value;
    highlightedCode.value = highlighted;
  }

  editor.on("text-change", () => {
    emailContent.value = editor.root.innerText.replace(/\n/g, "");
    emailContentBlock.value = editor.root.innerHTML;
    code.value = editor.root.innerHTML;
    highlightCode();
  });
};

watch(
  props.menuActive,
  () => {
    if (props.menuActive === "sendemail") {
      nextTick(() => {
        editRoot();
      });
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="content-user-input flex flex-col h-3/4 p-5 w-full">
    <div class="send--header border-b">发送邮件</div>
    <div class="send-btn flex">
      <el-button
        class="mt-3 border-[#83df7a] text-[#83df7a]"
        @click="handleSendEmail"
        >发送</el-button
      >
      <el-button class="mt-3 border-[#5da1da] text-[#5da1da]"
        >定时发送</el-button
      >
      <el-button class="mt-3 border-[#5da1da] text-[#5da1da]"
        >保存为草稿</el-button
      >
    </div>
    <div class="flex items-center">
      <div class="label w-20">收件人：</div>
      <el-select
        class="pt-3 pb-3 w-full"
        v-model="serderValue"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in props.users"
          :key="item._id"
          :label="item.username"
          :value="item._id"
        />
      </el-select>
    </div>
    <div class="flex items-center">
      <div class="label w-20">主题：</div>
      <el-input placeholder="请输入" v-model="themContet"></el-input>
    </div>
    <div class="label pb-4 w-20">正文：</div>
    <div ref="editorContainer" class="h-5/6"></div>

    <!-- <div class="flex justify-end">
      <el-button
        class="bg-[#0a57c3] mt-5 w-1/6"
        type="primary"
        @click="handleSendEmail"
        >发送</el-button
      >
    </div> -->
  </div>
</template>

<style scoped></style>
