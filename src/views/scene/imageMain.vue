<template>
  <!-- <el-row v-for="(o) in 4" :key="o"> -->
  <el-space wrap :size="70">
    <el-card v-for="i in sences.length" :key="i" class="box-card" :span="4" :offset="i > 0 ? 2 : 1"
      style="width: 250px;" @click="clickIMG(sences[i - 1].id)">
      <el-image style="width: 200px; " :src=sences[i-1].cover fit="fill" />
      <div style="padding: 14px">
        <span>{{ sences[i - 1].scene }}</span>
      </div>
    </el-card>


  </el-space>
  <div class="pagination-block">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[14, 28, 70, 140]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { GetImageSence } from "@/js/api/imageApi"
import router from "@/router"



const currentPage = ref(1)
const pageSize = ref(14)
const total = ref()

const pagination = reactive({
  results: pageSize.value,
  page: currentPage.value,
  param: {},
})
const handleSizeChange = (val: number) => {
  pagination.results = val
  selectScene(pagination)
}
const handleCurrentChange = (val: number) => {
  pagination.page = val
  selectScene(pagination)
}

const clickIMG = (id: string) => {
  router.push({ path: '/imageContent/' + id })
  console.log(id)
}
interface Scene {
  id: string;
  cover: string;
  scene: string;
}
function selectScene(pagination: any) {
  GetImageSence(pagination).then((res: any) => {
    total.value = res.data.total
    sences.value = res.data.data
  })

}

const sences = ref<Scene[]>([])
GetImageSence(pagination).then((res: any) => {
  total.value = res.data.total
  sences.value = res.data.data
})
</script>



<style scoped>
.pagination-block {
  float: right;
  margin-right: 50px;
}

.pagination-block+.pagination-block {
  margin-top: 10px;
}

.dpagination-block {
  margin-bottom: 16px;
}
</style>

<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>