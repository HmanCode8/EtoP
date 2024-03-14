<script setup>
import { ref, reactive, onMounted, computed, defineProps } from 'vue'
import ScrollDiv from '@/components/Until/ScrollDiv.vue'

import moment from 'moment'
import _ from 'lodash'
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
})

const computeds = computed(() => {
  return {
    msgDate: (date) => {
      return moment(date).format('YYYY-MM-DD')
    },
    msgTime: (date) => {
      return moment(date).format('HH:mm:ss')
    },
    dataSize: (data) => _.size(data),
  }
})
</script>

<template>
    <div class="content-user-list border-r lg:w-1/4 flex flex-col">
      <div class="user-title font-bold p-3 border-b h-[20]">收件箱({{ computeds.dataSize(messages) }})</div>
      <ul class="user-list flex-grow overflow-auto">
        <li v-for="m in [...props.messages,...props.messages]" :key="m._id" class="u-item">
          <div class="msg flex border-b items-center hover:bg-userListBg hover: cursor-pointer p-3">
            <div class="msg-l">
              <div class="avatar flex justify-center items-center border border-[#0058ff] w-8 h-8 bg-[#e5e5ff] rounded-full">
                <el-icon class="text-avatarColor"><UserFilled /></el-icon>
              </div>
            </div>
            <div class="msg-r pl-3 w-full">
              <div class="r-t flex justify-between w-full">
                <div class="name">{{ m.recipient }}</div>
                <div class="date text-[#c5c9ce] text-sm">{{ computeds.msgDate(m.timestamp) }}</div>
              </div>
              <div class="r-b text-[#c5c9ce]">{{ m.content }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>

<style scoped>

.ontent-user-list{
  height: calc(100vh - 50px);
  overflow: auto;
}

</style>
