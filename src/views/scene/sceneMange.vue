<template>
  <!-- 搜索栏 -->
  <div class="search-bar">
    <el-select v-model="searchType" style="width: 120px">
      <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-select v-if="searchType === 1" v-model="searchValue" multiple filterable style="width: 200px; margin-left: 10px"
      placeholder="请选择标签">
      <el-option v-for="tag in allTags" :key="tag.id" :label="tag.tagName" :value="tag.id" />
    </el-select>
    <el-input v-else v-model="searchValue" style="width: 200px; margin-left: 10px" placeholder="请输入搜索内容" />
    <el-button type="primary" style="margin-left: 10px" @click="handleSearch">
      搜索
    </el-button>

    <el-button type="primary" style="margin-left: 10px" @click="openAddDialog">
      新增场景
    </el-button>
  </div>

  <!-- 使用对话框组件 -->
  <SceneMangeDialog v-model="dialogVisible" :scene-data="formData" :mode="dialogMode"
    @submit-success="handleSubmitSuccess" />

  <!-- 表格 -->
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column property="scene" label="名称" width="240" />
    <el-table-column property="cover" label="封面" width="150">
      <template #default="scope">
        <el-image preview-teleported hide-on-click-modal :preview-src-list="[scope.row.cover]" :src="scope.row.cover"
          style="width: 100px; " />
      </template>
    </el-table-column>
    <el-table-column property="author" label="作者" width="120" />
    <el-table-column property="tag" label="标签" width="240">
      <template #default="scope">
        <el-tag style="margin-right:5PX;" v-for="tag in scope.row.tag" :key="tag.id" size="small" type="info">
          {{ tag }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column property="createdAt" label="上传时间" width="240" />
    <el-table-column property="updatedAt" label="修改时间" width="240" />
    <el-table-column fixed="right" label="操作" min-width="240">
      <template #default="socpe">
        <el-button text bg type="primary" @click="editScene(socpe.row)">修改</el-button>

        <el-button text bg type="danger">
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

import { ref, reactive, watch } from 'vue'
import SceneMangeDialog from '@/components/sceneMangeDialog.vue'
import { GetImageSence, GetSceneTagList, UpdateScene } from "@/js/api/imageApi"
import { ElMessage } from 'element-plus'


const currentPage = ref(1)
const pageSize = ref(14)
const total = ref()
//分页
const pagination = reactive({
  results: pageSize.value,
  page: currentPage.value,
  type: 0,
  param: {},
})
const uploadCover = ref({
  base64: '',
  filename: ''
})

// 对话框模式
const dialogMode = ref<'add' | 'edit'>('add')

// 打开新增对话框
const openAddDialog = () => {
  dialogMode.value = 'add'
  formData.value = {
    id: '',
    scene: '',
    cover: '',
    createTime: '',
    updateTime: '',
    author: '',
    tag: [],
    uploadCover: {
      id: '',
      base64: '',
      filename: ''
    }
  }
  dialogVisible.value = true
}

//分页每页数量改动
const handleSizeChange = (val: number) => {
  pagination.results = val
  selectScene(pagination)
}
//分页页码改动
const handleCurrentChange = (val: number) => {
  pagination.page = val
  selectScene(pagination)
}

const dialogVisible = ref(false)
const formData = ref<any>({
  id: '',
  scene: '',
  cover: '',
  createTime: '',
  updateTime: '',
  author: '',
  tag: [],
  uploadCover: {
    id: '',
    base64: '',
    filename: ''
  }
})

const allTags = ref<{ id: string; tagName: string }[]>([])
const tagLimit = 20 // 标签数量限制

// 打开编辑对话框
const editScene = (scene: Scene) => {
  dialogMode.value = 'edit'
  formData.value = JSON.parse(JSON.stringify(scene))
  dialogVisible.value = true
  // 获取标签列表
  GetSceneTagList().then((res: any) => {
    allTags.value = res.data
    if (scene.tag && scene.tag.length > 0) {
      formData.value.tag = allTags.value
        .filter(tag => scene.tag.includes(tag.tagName))
        .map(tag => tag.id)
    }
  })
}

// 处理提交成功
const handleSubmitSuccess = () => {
  // 刷新列表
  selectScene(pagination)
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


GetSceneTagList().then((res: any) => {
  allTags.value = res.data
})

GetImageSence(pagination).then((res: any) => {
  total.value = res.data.total
  let respDataList: Scene[] = []
  let respData: Scene
  res.data.data.forEach((item: any) => {
    respData = item
    if (item.tag == null || item.tag == undefined || item.tag.length == 0) {
      item.tag = ['无']
    } else {
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
})

function selectScene(pagination: any) {
  GetImageSence(pagination).then((res: any) => {
    total.value = res.data.total
    let respDataList: Scene[] = []
    let respData: Scene
    res.data.data.forEach((item: any) => {
      respData = item
      if (item.tag == null || item.tag == undefined || item.tag.length == 0) {
        item.tag = ['无']
      } else {
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
  })

}

const tableData = ref<Scene[]>([])

// 搜索相关
const searchType = ref(0)
const searchValue = ref('')
const searchTypes = [
  { label: '全文搜索', value: 0 },
  { label: '标签搜索', value: 1 },
  { label: '作者搜索', value: 2 },
  { label: '标题搜索', value: 3 }
]
// 搜索方法
const handleSearch = () => {

  pagination.type = searchType.value,
    pagination.param = {
      searchValue: searchValue.value // 这里传递的是标签ID数组
    }

  selectScene(pagination)
}
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
.search-bar {
  display: flex;
  margin-bottom: 20px;
  width: 33%;
}

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
