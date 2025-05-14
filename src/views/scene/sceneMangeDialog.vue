<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%" @close="dialogVisible = false">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="表单页" name="form">
        <el-form :model="formData" label-width="80px">
          <el-form-item label="场景名称">
            <el-input v-model="formData.scene" />
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="formData.author" />
          </el-form-item>
          <el-form-item label="封面图">
            <el-upload :data="uploadSceneCover" :auto-upload="false" :on-change="handleChange" :show-file-list="false">
              <el-image v-if="formData.cover" :src="formData.cover" style="width: 150px; " />
              <el-button v-else type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="标签">
            <el-transfer v-model="formData.tag" :data="allTags.map(tag => ({
              key: tag.id,       // 使用id作为key
              label: tag.tagName // 显示tagName作为label
            }))" :titles="['可选标签', '已选标签']" filterable />
            <div style="color: #999; display: block; width: 100%; margin-top: 8px; white-space: normal;">
              最多选择{{ tagLimit }}个标签
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="表格页" name="table" :disabled="!showChildScene">
        <el-table :data="childScene" border>
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="age" label="年龄" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { GetSceneTagList, AddScene, UpdateScene } from '@/js/api/imageApi'
import { ElMessage } from 'element-plus'

interface Tag {
  id: string
  tagName: string
}

interface SceneData {
  id: string
  scene: string
  cover: string
  createTime: string
  updateTime: string
  author: string
  tag: Tag[]
  uploadCover?: {
    id: string
    base64: string
    filename: string
  }
}

// 定义 props
const props = defineProps<{
  modelValue: boolean
  sceneData: SceneData
  mode: 'add' | 'edit'  // 新增模式标识
}>()

// 定义 emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit-success': []  // 提交成功事件
}>()

// 对话框可见性
const dialogVisible = ref(props.modelValue)

// 根据 mode 控制表格页是否可用
const showChildScene = computed(() => {
  return props.mode === 'edit'  // 编辑模式时可用，新增模式时禁用
})

// 监听对话框状态变化
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// 监听 mode 变化
watch(() => props.mode, (newMode) => {
  // 如果切换到新增模式，自动切换到表单页
  if (newMode === 'add') {
    activeTab.value = 'form'
  }
})

// 表单数据
const formData = reactive<SceneData>({
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

// 监听 sceneData 变化
watch(() => props.sceneData, (newVal) => {
  // 使用 Object.assign 更新所有字段
  Object.assign(formData, newVal)
}, { deep: true, immediate: true })

// 标签限制
const tagLimit = 20

// 所有标签
const allTags = ref<Tag[]>([])

// 子场景数据
const childScene = ref([])

// 当前激活的标签页
const activeTab = ref('form')

// 上传封面图数据
const uploadSceneCover = reactive({
  base64: '',
  filename: ''
})

// 获取标签列表
const fetchTags = async () => {
  try {
    const res = await GetSceneTagList()
    allTags.value = res.data
  } catch (error) {
    console.error('获取标签列表失败:', error)
  }
}

// 初始化时获取标签列表
fetchTags()

// 处理文件上传
const handleChange = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target?.result || typeof e.target.result !== 'string') {
        reject(new Error('Failed to read file as base64'))
        return
      }
      
      // 只更新图片相关字段，保持其他字段不变
      formData.cover = e.target.result
      formData.uploadCover = {
        id: formData.uploadCover?.id || '',  // 保持原有 id，如果不存在则使用空字符串
        base64: e.target.result,
        filename: file.name
      }
      
      console.log('更新后的 formData:', formData)  // 调试日志
      resolve(true)
    }
    reader.onerror = () => {
      reject(new Error('File reading failed'))
    }
    reader.readAsDataURL(file.raw)
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    let res: any
    if (props.mode === 'add') {
      // 新增场景
      res = await AddScene(formData)
    } else {
      // 修改场景
      res = await UpdateScene(formData)
    }

    if (res.code === 0) {
      ElMessage.success(res.message)
      dialogVisible.value = false
      emit('submit-success')  // 触发成功事件
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 计算对话框标题
const dialogTitle = computed(() => {
  return props.mode === 'add' ? '新增场景' : '修改场景'
})
</script>

<style scoped>
.el-transfer {
  width: 100%;
}
</style>
