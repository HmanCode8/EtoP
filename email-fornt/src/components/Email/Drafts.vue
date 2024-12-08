<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import _ from "lodash";
import SendEmail from "@/components/Email/SendEmail.vue";
import moment from "moment";
import { getDrafts, deleteDrafts } from "@/services/emailService";
import { ElMessage } from "element-plus";

interface Drafts {
  _id: string;
  timestamp: Date;
  recipientName: string;
  email: string;
  subject: string;
  content: string;
  checked: boolean;
}
const props = defineProps({
  users: {
    type: Array as () => any[],
    default: [],
  },
  menuActive: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["sendEmail"]);
const draftItem = ref<any>("");
// 使用 ref 创建响应式数据
const allchecked = ref<boolean>(false);
const showSendEmail = ref<boolean>(false);
const drafts = ref<Drafts[]>([]);
/**
 * 获取邮件列表
 */
const handleGetDrafts = async () => {
  try {
    const res = await getDrafts();
    if (res.code === 200) {
      drafts.value = res.data; // 假设 messages 是一个 ref 或 reactive 对象
    }
  } catch (error) {
    console.error(error);
  }
};
const onShowSendEmail = (data: any) => {
  showSendEmail.value = true;
  draftItem.value = data;
};

const handleSendEmail = (data: any) => {
  emit("sendEmail", data);
};
const handleDeleteDrafts = async () => {
  try {
    /**
     * 选中的ids
     */
    const isCheckDrafts = _.filter(drafts.value, "checked");
    if (_.size(isCheckDrafts) === 0) {
      return ElMessage.error("请选择邮件");
    }
    const id: string[] = _.map(isCheckDrafts, "_id");
    const res = await deleteDrafts({ ids: id });
    if (res.code === 200) {
      handleGetDrafts();
    } else {
      ElMessage.error(res.message);
    }
  } catch (error) {
    ElMessage.error("删除失败");
  }
};
const computers = computed(() => {
  return {
    computedDate: (date: any) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
  };
});

const allOnChage = (isCheck: boolean) => {
  const arr = _.map(drafts.value, (item: any) => ({
    ...item,
    checked: isCheck,
  }));
  drafts.value = arr;
  allchecked.value = isCheck;
};

const handleChage = (data: boolean, id: string) => {
  const arr = _.map(drafts.value, (item: any) => ({
    ...item,
    checked: item._id === id ? data : item.checked,
  }));
  drafts.value = arr;
  allchecked.value = _.every(arr, (i) => i.checked);
};
onMounted(() => {
  handleGetDrafts();
});
</script>

<template>
  <SendEmail
    v-if="showSendEmail"
    type="drafts"
    :draftItem="draftItem"
    :users="props.users"
    :menuActive="props.menuActive"
    @sendEmail="handleSendEmail"
    @onBack="showSendEmail = false"
  />

  <div class="email-car-bg-color w-full flex flex-col" v-else>
    <div class="p-4">草稿箱</div>
    <div class="p-4">
      <el-button class="email-btn" type="danger" @click="handleDeleteDrafts"
        >删除邮件</el-button
      >
    </div>
    <div class="text-[#f8f8f8] pl-4">
      <el-checkbox
        :model-value="allchecked"
        @change="allOnChage"
        label="全选"
        size="large"
      />
    </div>
    <ul class="drafts pl-1 overflow-auto">
      <li v-for="m in drafts" :key="m._id" class="d-item flex p-3 items-center">
        <div class="w-1/6">
          <el-checkbox
            @change="(data:boolean)=>handleChage(data,m._id)"
            v-model="m.checked"
            size="large"
          />
        </div>
        <div class="w-5/6 flex justify-between items-center">
          <div class="pl-4">{{ m.recipientName }} <{{ m.email }}></div>
          <div class="pl-10 flex draf-content">
            <div class="text-[#a2c8e9]">
              <el-icon
                @click="onShowSendEmail(m)"
                class="hover:text-[#6fbff9] hover:cursor-pointer font-bold size-10"
                ><Link
              /></el-icon>
            </div>
            {{ m.subject }} ———
            <span class="">{{ m.content }}</span>
          </div>
          <div>{{ computers.computedDate(m.timestamp) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.draf-content {
  width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // /deep/ .el-checkbox__label {
  //   color: aqua; /* 修改颜色为aqua */
  //   font-weight: bold; /* 修改为粗体 */
  // }
}
</style>
