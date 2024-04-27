<script setup lang="ts">
import { toRefs, computed } from "vue";

const props = defineProps({
  pageTotal: {
    type: Number,
    default: 1,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  // pageSize: {
  //   type: Number,
  //   default: 10,
  // },
});

const { pageTotal, currentPage } = toRefs(props);
const emits = defineEmits(["pageChange"]);
const onPageChange = (page: number) => {
  currentPage.value = page;
  emits("pageChange", page);
};
//下一页
const onNextPage = () => {
  if (currentPage.value === pageTotal.value) return;
  onPageChange(currentPage.value + 1);
};

//上一页
const onPrePage = () => {
  if (currentPage.value === 1) return;
  onPageChange(currentPage.value - 1);
};
//首页
const onFirstPage = () => {
  onPageChange(1);
};
//末页
const onLastPage = () => {
  onPageChange(pageTotal.value);
};
console.log("pageTotal", pageTotal.value);
const pageList = computed(() => {
  const list = [];
  for (let i = 0; i < 3; i++) {
    if (currentPage.value + i > pageTotal.value) {
      break;
    }
    list.push(i + currentPage.value);
  }
  return list;
});
</script>

<template>
  <!-- 分页组件 -->
  <div class="pagination flex text-sm justify-end items-center">
    <div
      @click="onFirstPage"
      class="frist-page m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white"
    >
      首页
    </div>
    <div
      @click="onPrePage"
      class="pre m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white"
    >
      &lt;
    </div>
    <div class="page-list flex">
      <div
        :class="`page ${
          currentPage === i ? 'active' : ''
        } m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white`"
        v-for="i in pageList"
        @click="onPageChange(i)"
        :key="i"
      >
        {{ i }}
      </div>
    </div>
    <div
      @click="onNextPage"
      class="next m-2 p-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] bg-white"
    >
      &gt;
    </div>
    <div
      @click="onLastPage"
      class="last-page m-2 hover:bg-[#9999ff] hover:cursor-pointer hover:text-[#fff] p-2 bg-white"
    >
      末页
    </div>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  div {
    min-width: 40px;
    text-align: center;
  }
}
.page-list .page {
  &.active {
    background-color: #9999ff;
    color: #fff;
  }
}
</style>
