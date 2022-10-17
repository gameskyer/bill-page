<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="表名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="主键名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="分批索引字段名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="分批索引类型">
      <el-select v-model="value1" multiple placeholder="自增ID/时间" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="分割时间">
      <el-select v-model="value1" multiple placeholder="年/月/日" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="开始和结束时间">
      <el-date-picker v-model="value2" type="datetimerange" range-separator="至" start-placeholder="开始时间"
        end-placeholder="结束时间" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
const value1 = ref([])
const value2 = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style scoped>
.el-form-item {
  width: 30%;
}

.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.block:last-child {
  border-right: none;
}

.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>