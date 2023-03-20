<template>
  <HelloWorld :count="total" :priceAvg="priceAvg" :priceSum="priceSum" />
  <el-form ref="ruleFormRef" :inline="true" :model="ruleForm" class="demo-form-inline">
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入查询名称" />
    </el-form-item>
    <el-form-item label="类型" prop="billTypes">
      <el-select v-model="ruleForm.billTypes" placeholder="请选择类型(多选)" style="width: 240px" multiple collapse-tags
        clearable>
        <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="日期" prop="date">
      <!-- <el-select v-model="ruleForm.date" placeholder="日期" clearable> -->
      <el-cascader v-model="value" :options="dateList" @change="handleChange" />
      <!-- <el-option v-for="option in dateList" :key="option.value" :label="option.label" :value="option.value" /> -->
      <!-- </el-select> -->
    </el-form-item>
    <el-form-item label="日期区间" prop="dateRange">
      <el-date-picker v-model="ruleForm.dateRange" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
        :default-value="[new Date(2010, 9, 1), new Date(2010, 10, 1)]" />
    </el-form-item>

    <el-form-item>
      <el-upload v-model:file-list="fileList" class="upload-demo" :show-file-list="false"
        action="http://127.0.0.1:8004/table/uploadExcel" multiple :on-preview="handlePreview" :on-remove="handleRemove"
        :before-remove="beforeRemove" :limit="3" :on-exceed="handleExceed">
        <el-button type="primary">上传表格</el-button>
      </el-upload>

      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="resetForm(ruleFormRef)">清除</el-button>
      <!-- <el-button> Click to upload
        <el-upload v-model:file-list="fileList" class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple :on-preview="handlePreview"
          :on-remove="handleRemove" :before-remove="beforeRemove" :limit="3" :on-exceed="handleExceed">

        </el-upload> -->
      <!-- </el-button>  -->
    </el-form-item>
  </el-form>
  <div style="height: 75%">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="tableData" :width="width" :height="height" :fixed="true" />
      </template>
    </el-auto-resizer>
  </div>
  <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
    :background="true" layout="->,total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange" />
</template>
<style>
.el-upload {
  margin: 0px 15px 0px 0px;
}
</style>
<script lang="tsx" setup>
import { reactive, ref } from 'vue';
import { SelectBill, GetBillTypeList, GetBillDateList } from '@/js/api/billApi';
import { ElMessage, ElMessageBox, TableV2SortOrder, ElButton } from 'element-plus';

import type { UploadProps, UploadUserFile, FormInstance, Column, } from 'element-plus';
import HelloWorld from '@/components/HelloWorld.vue';

//上传组件
const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length
    } files this time, add up to ${files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfert of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};
//表格
const priceAvg = ref();
const priceSum = ref();
const columns: Column<any>[] = [
  {
    dataKey: 'billName',
    key: 'billName',
    title: '消费名称',
    width: 150,
  },
  {
    dataKey: 'billDate',
    key: 'billDate',
    title: '消费日期',
    width: 150,
  },
  {
    dataKey: 'billPrice',
    key: 'billPrice',
    title: '消费金额',
    width: 150,
  },
  {
    dataKey: 'billTypeName',
    key: 'billTypeName',
    title: '消费类型',
    width: 150,
  }, {
    key: 'operations',
    title: 'Operations',
    cellRenderer: () => (
      <>
        <ElButton size="small" onClick={getRowData}>Edit</ElButton>
        <ElButton size="small" onClick={getRowData} type="danger">
          Delete
        </ElButton>
      </>
    ),
    width: 150,
    align: 'center',
    flexGrow: 1,
  },
];

const total = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: '',
  date: '',
  dateRange: '',
  billTypes: [],
});
const param = reactive({
  results: pageSize.value,
  page: currentPage.value,
  data: ruleForm,
});

const tableData = ref([]);
getBillData(param);
//分页

const handleSizeChange = (val: number) => {
  param.results = val;
  getBillData(param);
};
const handleCurrentChange = (val: number) => {
  param.page = val;
  getBillData(param);
};
//表单
const options = ref<any>([]);
const dateList = ref<any>([]);

GetBillTypeList().then((res) => {
  let arr = new Array();
  Object.keys(res.data).forEach((key) => {
    let obj: any = new Object();
    obj.value = res.data[key].billType;
    obj.label = res.data[key].billTypeName;
    arr.push(obj);
  });
  options.value = arr;
});

const getRowData = ((row: any) => {
  console.log(row.ids)
})

GetBillDateList().then((res) => {
  let arr = new Array();
  Object.keys(res.data).forEach((key) => {
    let obj: any = new Object();
    obj = res.data[key];
    arr.push(obj);
  });

  dateList.value = arr;
  console.log(dateList.value)
});
const value = ref([])
const handleChange = (value: any) => {
  var date = ""
  for (const aa of value) {
    date += aa
  }
  ruleForm.date = date as unknown as string
  console.log(value[1])
}
const props = {
  expandTrigger: 'hover' as const,
}
const onSubmit = () => {
  getBillData(param);
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getBillData(param);
};

function getBillData(param: Object) {
  SelectBill(param).then((res) => {
    tableData.value = res.data.bill;
    total.value = res.data.total;
    priceAvg.value = res.data.priceAvg;
    priceSum.value = res.data.priceSum;
  });
}
</script>
<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>

