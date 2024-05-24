<script setup lang="ts">
import { ref, onMounted, computed, watch, inject, nextTick } from 'vue'
import { addFruit, getFruits, deleteFruit, updateFruit } from '@/services/fruitsServices'
import _ from 'lodash'
interface FruitItem {
  name: string
  imgUrl: string
  description: string
  color: string
}

const initialFruits: FruitItem = {
  name: '',
  imgUrl: '',
  description: '',
  color: '',
}

const gsap: any = inject('gsap')

const fruits = ref<FruitItem[]>([])
const editingFruit = ref<FruitItem | any>(null)
const visibleModal = ref(false)
const modalType = ref('add')
const fTotal = ref(0)
const searchKeyword = ref('')
const currentPage = ref<number>(1)
const pageSize = 8

const filteredFruits = computed(() => {
  // Filter the fruits based on the search keyword
  const keyword = searchKeyword.value.toLowerCase()
  return _.filter(fruits.value as any, (fruit: FruitItem) => fruit.name.toLowerCase().includes(keyword) || fruit.description.toLowerCase().includes(keyword))
})

const onSearchFruit = () => {
  // Perform search logic based on searchKeyword
  currentPage.value = 1 // Reset current page to 1 when performing a new search
}

const getAvatarUrl = (color: string) => {
  // Return the URL of the avatar image based on the fruit color
  return `https://dummyimage.com/100x100/${color}/fff&text=+`
}

const handleAddFruit = async () => {
  // Add a random fruit to the fruits list
  const res = await addFruit(editingFruit.value)
  if (res.code === 200) {
    handleGetFruits()
    editingFruit.value = initialFruits
    visibleModal.value = false
  }
}

const handleGetFruits = async () => {
  // Get the list of fruits from the server
  const res = await getFruits({ page: currentPage.value, pageSize })
  if (res.code === 200) {
    fruits.value = res.data.fruits
    fTotal.value = res.data.total
  }
}
handleGetFruits()

const handleDeleteFruit = async (id: string) => {
  // Delete a fruit from the fruits list
  const res = await deleteFruit({ id })
  if (res.code === 200) {
    handleGetFruits()
  }
}

const saveEditedFruit = async () => {
  // Save the edited fruit to the server
  if (editingFruit.value) {
    const res = await updateFruit(editingFruit.value)
    if (res.code === 200) {
      handleGetFruits()
      editingFruit.value = initialFruits
      visibleModal.value = false
    }
  }
}
watch(currentPage, () => {
  // Perform any data fetching logic based on the current page
  handleGetFruits()
})
onMounted(() => {
  // Perform any initial setup or data fetching logic
})

watch(fruits, () => {
  nextTick(() => {
    gsap.fromTo('.item-even', { opacity: 0, x: 200 }, { opacity: 1, x: 0, duration: 1.5, ease: 'bounce' })
  })
  nextTick(() => {
    gsap.fromTo('.item-odd', { opacity: 0, y: -200 }, { opacity: 1, y: 0, duration: 1.5, ease: 'bounce' })
  })
})
</script>

<template>
  <div class="markdown min-h-36">
    <div class="flex justify-between items-center mb-4">
      <a-input-search v-model:value="searchKeyword" placeholder="input search text" style="width: 200px" @search="onSearchFruit" />
      <div
        @click="
          modalType = 'add';
          editingFruit = initialFruits;
          visibleModal = true
        "
        class="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        随机新增一个水果
      </div>
    </div>
    <div class="list-container min-h-128">
      <div :class="`item-${index % 2 === 0 ? 'even' : 'odd'} flex  my-1 justify-between items-center  p-2`" v-for="fruit,index in filteredFruits" :key="fruit._id">
        <div class="flex items-center">
          <img class="w-8 h-8 rounded-full" :src="fruit.imgUrl || getAvatarUrl(fruit.color)" alt="avatar"></img>
        <div class="flex flex-col ml-4">
          <div>{{ fruit.name }}</div>
          <div class="description text-sm text-gray-400">{{ fruit.description }}</div>
        </div>
        </div>
        <div class="actions">
          <a-popconfirm title="确认删除？" @confirm="() => handleDeleteFruit(fruit._id)"><span class="hover:text-red-500 cursor-pointer"> 删除</span> </a-popconfirm>
          <a-icon
            type="edit"
            class="hover:text-blue-500 px-4 cursor-pointer"
            @click="
              visibleModal = true;
              editingFruit = fruit;
              modalType = 'edit'
            "
            >编辑</a-icon
          >
        </div>
      </div>
      <!-- <a-list item-layout="horizontal" :data-source="filteredFruits">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :description="item.description">
            <template #title>
              {{ item.name }}
            </template>
            <template #avatar>
              <a-avatar :src="item.imgUrl||getAvatarUrl(item.color)" />
            </template>
          </a-list-item-meta>
          <a-popconfirm title="确认删除？" @confirm="() => handleDeleteFruit(item._id)"><span class="hover:text-red-500 cursor-pointer"> 删除</span> </a-popconfirm>
          <a-icon
            type="edit"
            class="hover:text-blue-500 px-4 cursor-pointer"
            @click="visibleModal = true; editingFruit = item ; modalType = 'edit'"
          >编辑</a-icon>
        </a-list-item>
      </template>
    </a-list> -->
    </div>
    <div class="flex items-center mt-4">
      <span>共 {{ fTotal }} 个水果</span>
      <a-pagination v-model:current="currentPage" :total="fTotal" :show-less-items="true" :page-size="pageSize" />
    </div>
  </div>
  <a-modal v-model:visible="visibleModal" :title="modalType === 'edit' ? '编辑水果' : '新增水果'" width="50%" :footer="null">
    <a-form :model="editingFruit">
      <a-form-item label="名称">
        <a-input v-model:value="editingFruit.name" />
      </a-form-item>
      <a-form-item label="图片地址">
        <a-input v-model:value="editingFruit.imgUrl" />
      </a-form-item>
      <a-form-item label="描述">
        <a-input v-model:value="editingFruit.description" />
      </a-form-item>
      <a-form-item label="颜色">
        <a-input v-model:value="editingFruit.color" />
      </a-form-item>
      <a-button @click="modalType === 'edit' ? saveEditedFruit() : handleAddFruit()" type="primary">保存</a-button>
    </a-form>
  </a-modal>
</template>
<style scoped lang="scss"></style>
