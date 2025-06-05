<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%" @close="dialogVisible = false">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="详情" name="form">
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

      <el-tab-pane label="内容" name="table" :disabled="!showChildScene">
        <el-button type="primary" @click="dialogUploadFormVisible = true">上传内容</el-button>

        <el-table :data="childScene" border>
          <el-table-column prop="childSceneName" label="名称" />
          <el-table-column prop="createdAt" label="上传时间" />
          <el-table-column prop="updatedAt" label="修改时间" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>

  <!-- 上传表单 -->
  <el-dialog v-model="dialogUploadFormVisible" title="Shipping address" width="500">
    <el-form :model="uploadForm" class="upload-form">
      <el-form-item label="名称" :label-width="'80px'" class="form-item">
        <el-input v-model="uploadForm.childSceneName" autocomplete="off" placeholder="为空时使用压缩包文件名称" />
      </el-form-item>
      <el-upload 
        class="upload-demo" 
        drag 
        :action="uploadUrl" 
        :auto-upload="false" 
        multiple 
     
        :http-request="customUpload" 
        ref="uploadRef"
        :file-list="fileList"
        :on-change="handleFileChange"
        :limit="10"
        :on-exceed="handleExceed"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持多个文件上传，大小不超过 500kb
          </div>
        </template>
      </el-upload>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogUploadFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUploadConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { GetSceneTagList, AddScene, UpdateScene, GetImageList } from '@/js/api/imageApi'
import { ElMessage } from 'element-plus'

const dialogUploadFormVisible = ref(false)
const formLabelWidth = '140px'
const uploadForm = reactive({
  childSceneName: '',
  parentScene: '',
})

// 添加上传相关的引用和方法
const uploadRef = ref()
const uploadUrl = 'http://localhost:8004/image/uploadChildScene'

// 添加文件列表
const fileList = ref([])

// 处理文件变化
const handleFileChange = (file: any, files: any) => {
  fileList.value = files
}

// 处理文件超出限制
const handleExceed = (files: any) => {
  ElMessage.warning(`最多只能上传 10 个文件`)
}

// 修改自定义上传方法
const customUpload = async (options: any) => {
  // 如果是第一个文件，执行上传
  if (options.file.uid !== fileList.value[0].uid) {
    return
  }

  const formData = new FormData()
  
  // 添加所有文件
  fileList.value.forEach((file: any) => {
    formData.append('files', file.raw)
  })
  
  // 添加其他表单数据
  formData.append('childSceneName', uploadForm.childSceneName)
  formData.append('parentScene', props.sceneData.id)

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const result = await response.json()
      // 对所有文件都调用成功回调
      fileList.value.forEach(() => {
        options.onSuccess(result)
      })
    } else {
      // 对所有文件都调用失败回调
      fileList.value.forEach(() => {
        options.onError(new Error('上传失败'))
      })
    }
  } catch (error) {
    // 对所有文件都调用失败回调
    fileList.value.forEach(() => {
      options.onError(error)
    })
  }
}

// 修改确认按钮的处理方法
const handleUploadConfirm = () => {
  // 触发表单验证
  if (!uploadForm.childSceneName) {
    ElMessage.warning('请输入名称')
    return
  }
  
  // 检查是否有文件
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  // 获取上传组件实例并提交第一个文件
  // 由于我们在 customUpload 中做了处理，只需要提交第一个文件即可
  uploadRef.value.submit()
}

// 修改上传成功处理



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

// 获取子场景数据
const fetchChildScene = async () => {
  try {
    const res = await GetImageList(props.sceneData.id)
    childScene.value = res.data
  } catch (error) {
    console.error('获取子场景数据失败:', error)
  }
}
// fetchChildScene()
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

.left-align-form-item {
  text-align: center;

  :deep(.el-form-item__content) {
    justify-content: flex-start;
  }
}

.upload-form {

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__content) {
    display: flex;
    justify-content: flex-start;
  }

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
  }
}

.form-item {
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}
</style>
