<script setup>
import Quill from 'quill'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'quill/dist/quill.snow.css'

import { ref, reactive, defineEmits, watch, defineProps, nextTick } from 'vue'

const editorContainer = ref('')
const fontSize = reactive([1, 2, 3, 4])
const emailContent = ref('')
const emailContentBlock = ref('')
const code = ref('')
const highlightedCode = ref('')
const serderValue = ref('')
const senderOptions = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
// const menuActive = ref(prop.menuActive)
const emit = defineEmits(['sendEmail'])

const props = defineProps({
  menuActive: {
    type: Number,
    default: 1,
  },
  users: {
    type: Array,
    default: () => [],
  },
})
const handleSendEmail = () => {
  const params = { content: emailContent.value, contentBlock: emailContentBlock.value, recipient: serderValue.value }
  emit('sendEmail', params)
}

let editor
const editRoot = () => {
  editor = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [...fontSize, true] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }, { align: ['center'] }, { align: ['right'] }, { align: ['justify'] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote'],
        ['link'],
        ['image'],
        ['code-block'],
        [{ table: 'table' }],
        ['undo', 'redo'],
        ['clean'],
      ],
    },
  })

  function highlightCode() {
    const highlighted = hljs.highlightAuto(code.value).value
    highlightedCode.value = highlighted
  }

  editor.on('text-change', () => {
    emailContent.value = editor.root.innerText.replace(/\n/g, '')
    emailContentBlock.value = editor.root.innerHTML
    code.value = editor.root.innerHTML
    highlightCode()
  })
}

watch(
  props.menuActive,
  () => {
    if (props.menuActive === 1) {
      nextTick(() => {
        editRoot()
      })
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="content-user-input flex flex-col h-3/4 p-5 w-full">
    <el-select class="pt-3 pb-3 w-full" v-model="serderValue" clearable placeholder="选择发送给谁">
      <el-option v-for="item in props.users" :key="item._id" :label="item.username" :value="item._id" />
    </el-select>
    <div ref="editorContainer" class="h-5/6"></div>
    <div class="flex justify-end">
      <el-button class="bg-[#0a57c3] mt-5 w-1/6" type="primary" @click="handleSendEmail">发送</el-button>
    </div>
  </div>
</template>

<style scoped></style>
