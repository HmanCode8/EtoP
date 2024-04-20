<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import ScrollDiv from "@/components/Until/ScrollDiv.vue";
import moment from "moment";
import _ from "lodash";
import {
  getEmail,
  deleteEmail,
  updateReadStatus,
} from "@/services/emailService";
const props = defineProps({
  userInfo: {
    type: Object,
  },
});

const messages = ref([]);
const emailId = ref("");

// 定义触发自定义事件的方法
const handleChooseEmailId = async (id) => {
  emailId.value = id;
  /**
   * 更新邮件状态
   */

  try {
    const res = await updateReadStatus({ messageId: id, status: "read" });
    if (res.code === 200) {
      handleGetEmail();
    } else {
      ElMessage({
        message: "更新失败",
        type: "error",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
const computers = computed(() => {
  return {
    emailContent: _.find(messages.value, { _id: emailId.value }) || {},
    msgDate: (date, format) => {
      return moment(date).format(format);
    },
    dataSize: (data) => _.size(data),
  };
});

/**
 * 获取邮件列表
 */
const handleGetEmail = async () => {
  try {
    const res = await getEmail();
    if (res.code === 200) {
      messages.value = res.data; // 假设 messages 是一个 ref 或 reactive 对象
    }
  } catch (error) {
    console.error(error);
  }
};

//删除邮件
const handleDeleteEmail = async () => {
  try {
    const res = await deleteEmail();
    if (res.code === 200) {
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      handleGetEmail();
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  handleGetEmail();
});
</script>

<template>
  <div class="content-user-list email-br-color w-1/4 flex flex-col">
    <div class="user-title font-bold p-3 h-[20]">
      收件箱({{ computers.dataSize(messages) }})
      <span class="text-[#c9d9ee] font-serif"> {{ props.email }}</span>
    </div>
    <ul class="user-list">
      <li
        v-for="m in messages"
        :key="m._id"
        @click="handleChooseEmailId(m._id)"
        class="u-item"
      >
        <div
          class="msg flex email-bb-color items-center hover:bg-userListBg hover: cursor-pointer p-3"
        >
          <div class="msg-l w-[10%]">
            <div
              class="avatar flex justify-center items-center border border-[#0058ff] w-8 h-8 bg-[#e5e5ff] rounded-full"
            >
              <el-icon><UserFilled /></el-icon>
            </div>
          </div>
          <div class="msg-r pl-3 w-[85%]">
            <div class="r-t flex items-center justify-between">
              <div class="name w-[120px] overflow-hidden">
                {{ m.subject || "--" }}
              </div>
              <div class="date text-[#c5c9ce] text-sm">
                {{ computers.msgDate(m.timestamp, "YYYY-MM-DD") }}
              </div>
            </div>
            <div
              class="r-b text-[#c5c9ce] h-[50px] w-2/3 overflow-hidden flex justify-between"
            >
              {{ m.content }}
            </div>
          </div>
          <div class="w-[5%]">
            <!-- 是否已读小圆点，未读则不显示 -->
            <div
              v-if="m.status !== 'read'"
              class="dot flex justify-center items-center w-2 h-2 bg-[#ff0000] rounded-full"
            >
              <i class="el-icon el-icon-circle-close text-white"></i>
            </div>
          </div>
          <div class="w-[5%]">
            <el-popconfirm
              :key="m._id"
              class="custom-class"
              @confirm="handleDeleteEmail(m._id)"
              title="Are you sure delete?"
            >
              <template #reference>
                <!-- <el-button type="primary">212</el-button> -->
                <el-icon style="color: #f00"><Delete /></el-icon>
                <!-- <button class="text-[#f00]">121</button> -->
              </template>
            </el-popconfirm>
          </div>
        </div>
      </li>
    </ul>
    <!-- <el-empty v-else :image-size="200" /> -->
  </div>
  <div class="content-user-input flex flex-col p-5 w-3/4" v-if="emailId !== ''">
    <div class="rounded-md p-3 m-10-auto bg-[#f7f7f7]">
      <div class="font-bold overflow-hidden flex justify-center items-center">
        {{ computers.emailContent.subject }}
      </div>
      <div class="text-[#b7b7b8]">
        发件时间：{{
          computers.msgDate(
            computers.emailContent.timestamp,
            "YYYY-MM-DD:HH:mm:ss"
          )
        }}
      </div>
      <div class="text-[#b7b7b8]">
        发件人：{{ computers.emailContent.senderName }}
      </div>
      <div class="text-[#b7b7b8]">
        收件人：{{ computers.emailContent.recipientName }}
      </div>
    </div>
    <div class="m-5" v-html="computers.emailContent.contentBlock"></div>
  </div>
</template>

<style scoped>
.ontent-user-list {
  height: calc(100vh - 50px);
  overflow: auto;
}
.r-b {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
