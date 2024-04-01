<script setup>
import Quill from "quill";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "quill/dist/quill.snow.css";
import _ from "lodash";

import { ref, reactive, watch, nextTick, onMounted } from "vue";

const editorContainer = ref("");
const fontSize = reactive([1, 2, 3, 4]);
const emailContent = ref("");
const emailContentBlock = ref("");
const imgSrc = ref([]);
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
const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["sendEmail"]);

const messageInfo = (m) => {
  ElMessage({
    showClose: true,
    message: m,
    type: "warning",
  });
};

const handleSendEmail = () => {
  if (!serderValue.value) {
    return messageInfo("请选择收件人");
  }
  if (!themContet.value) {
    return messageInfo("请输入主题内容");
  }

  if (!emailContent.value) {
    return messageInfo("请输入邮件内容");
  }

  const recipientName = _.get(
    _.find(props.users, { _id: serderValue.value }),
    "username"
  );
  const params = {
    content: emailContent.value,
    contentBlock: emailContentBlock.value,
    recipientName,
    recipient: serderValue.value,
    themContet: themContet.value,
  };

  emit("sendEmail", params);
};

let editor;
const editRoot = () => {
  editor = new Quill(editorContainer.value, {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [...fontSize, true] }],
        ["bold", "italic", "underline", "strike"],
        [
          { align: [] },
          { align: ["center"] },
          { align: ["right"] },
          { align: ["justify"] },
        ],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        ["link"],
        ["image", "video"],
        [{ table: "table" }],
        ["undo", "redo"],
        ["clean"],
      ],
    },
    placeholder: "请输入正文",
  });

  function highlightCode() {
    const highlighted = hljs.highlightAuto(code.value).value;
    highlightedCode.value = highlighted;
  }

  editor.on("text-change", (delta, oldDelta, source) => {
    // console.log('editor.root',editor.root)
    delta.ops.forEach((op) => {
      // 检查操作的内容是否为 'image'
      if (op.insert && op.insert.image) {
        // 获取 image 元素的 src 属性
        const src = op.insert.image;
        imgSrc.value = [...imgSrc.value, src];
        // 然后您可以对获取到的 src 属性进行进一步处理
      }
    });

    emailContent.value = editor.root.innerText.replace(/\n/g, "");
    emailContentBlock.value = editor.root.innerHTML;
    code.value = editor.root.innerHTML;
    highlightCode();
  });
};

onMounted(() => {
  editRoot();
});
</script>

<template>
  <div class="content-user-input flex flex-col h-3/4 p-5 w-full">
    <div class="send--header border-b">发送邮件</div>
    <div class="send-btn flex">
      <el-button type="success" plain class="mt-3" @click="handleSendEmail"
        >发送</el-button
      >
      <el-button type="primary" plain class="mt-3">定时发送</el-button>
      <el-button type="danger" plain class="mt-3">保存为草稿</el-button>
      <!-- <button id="upload"></button> -->
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
    <div class="flex items-center border-b pb-4">
      <div class="label w-20">主题：</div>
      <el-input placeholder="请输入" v-model="themContet"></el-input>
    </div>
    <div class="label pb-4 pt-4 w-20">正文：</div>
    <div ref="editorContainer" class="h-3/4"></div>

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
