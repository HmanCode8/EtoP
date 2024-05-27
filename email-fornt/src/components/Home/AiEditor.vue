<script setup lang="ts">
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import { onMounted, onUnmounted, ref} from 'vue'



const divRef = ref()
let aiEditor: AiEditor | null = null
const editContent = ref('')
onMounted(() => {
  console.log('onMounted')
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    placeholder: '点击输入内容...',
    content: '',
    theme: 'light',
    onChange: (content: any) => {
      editContent.value = content.getHtml()
    },
    ai: {
      models: {
        spark: {
          appId: 'bb26f2f2',
          apiKey: '18cfb88ba62c8fa308569221f1e2de6f',
          apiSecret: 'ZGJkZWYxMGUyYjQ3YmE1Zjk2NWRlN2Rh',
          version: 'v3.5',
        },
        bubblePanelEnable: true,
        bubblePanelModel: 'spark',
        onCreateClientUrl: '....',
      },
    },
  })
})

onUnmounted(() => {
  aiEditor && aiEditor.destroy()
})
</script>

<template>
  <!-- <div
      v-html="editContent"
      class="bg-white shadow-lg rounded-sm w-1/2 flex flex-col"
    ></div> -->
  <div class="shadow-lg rounded-sm" ref="divRef" style="height: 600px" />
</template>

<style></style>
