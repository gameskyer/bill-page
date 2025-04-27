<template>
 <!-- 在template最外层添加dialog -->
 <el-dialog v-model="dialogVisible" title="编辑场景" width="50%">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="场景名称">
        <el-input v-model="formData.scene" />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="formData.author" />
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          action="/api/upload" 
          :on-success="handleUploadSuccess"
          :show-file-list="false"
        >
          <el-image 
            v-if="formData.cover" 
            :src="formData.cover" 
            style="width: 100px; height: 100px"
          />
          <el-button v-else type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="标签">
        <el-transfer
          v-model="formData.tag"
          :data="allTags.map(tag => ({ key: tag, label: tag }))"
          :titles="['可选标签', '已选标签']"
          filterable
        />
        <div style="color: #999">最多选择{{tagLimit}}个标签</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>

  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column property="scene" label="名称" width="240" />
    <el-table-column
      property="childScene"
      label="子集"
      width="240"
      show-overflow-tooltip
    />
    <el-table-column property="cover" label="封面" width="150">
      <template #default="scope">
      <el-image preview-teleported hide-on-click-modal :preview-src-list="[scope.row.cover]" :src="scope.row.cover" style="width: 100px; " />
    </template>
    </el-table-column>
    <el-table-column property="author" label="作者" width="240" />
    <el-table-column property="tag" label="标签" width="240" >
      <template #default="scope">
        <el-tag style="margin-right:5PX ;" v-for="(tag, index) in scope.row.tag" :key="index" size="small" type="info">{{ tag }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column property="createTime" label="上传时间" width="240" />
    <el-table-column property="updateTime" label="修改时间" width="240" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="socpe">
        <el-button text bg type="primary" @click="editScene(socpe.row)" >修改</el-button>

        <el-button text bg  type="danger" >
          删除
        </el-button>
      </template>

    </el-table-column>
  </el-table>
<!-- 分页 -->
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
import { ElMessage } from 'element-plus'



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

const dialogVisible = ref(false)
const formData = ref<Scene>({
  id: '',
  scene: '',
  childScene: [],
  cover: '',
  createTime: '',
  updateTime: '',
  author: '',
  tag: []
})
const allTags = ref<string[]>([]) // 所有可选标签
const tagLimit = 20 // 标签数量限制

const editScene = (scene: Scene) => {
  formData.value = JSON.parse(JSON.stringify(scene))
  dialogVisible.value = true
  // TODO: 这里需要获取所有可选标签
}

const handleSubmit = () => {
  if (formData.value.tag.length > tagLimit) {
    ElMessage.error(`标签数量不能超过${tagLimit}个`)
    return
  }
  // TODO: 调用API提交修改
  dialogVisible.value = false
}

const handleUploadSuccess = (response: any) => {
  formData.value.cover = response.data.url // 假设返回结构
}

interface Scene {
  id: string
  scene: string
  childScene: string[]
  cover: string
  createTime: string
  updateTime: string
  author: string
  tag: string[]
}
function selectScene(pagination: any) {
  GetImageSence(pagination).then((res: any) => {
    total.value = res.data.total
    tableData.value = res.data.data
  })

}

// const sences = ref<Scene[]>([])
const tableData = ref<Scene[]>([]) 
GetImageSence(pagination).then((res: any) => {
  total.value = res.data.total
  let respDataList: Scene[] = []
  let respData : Scene
  res.data.data.forEach((item:any) => {
    // console.log(item.tag)
    respData = item
    if (item.tag == null || item.tag == undefined || item.tag.length == 0) {
      item.tag = ['无']
    }else{
      let tagList = item.tag.map((tag: any) => {
      if (tag.tagName) {
        return tag.tagName
      }
    })
    
    respData.tag = tagList
    }
   respDataList.push(respData)
  })
  tableData.value = respDataList
  console.log(respDataList)
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
.cell {
  text-align: center;

}
</style>
