<template>
  <el-dialog v-model="dialogVisible" title="提示" width="30%" :before-close="handleClose">
    <span>你确定要删除该记录吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="DeleteData(rowData)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

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
      <el-cascader v-model="value" :options="dateList" @change="handleChange" />
    </el-form-item>
    <el-form-item label="日期区间" prop="dateRange">
      <el-date-picker v-model="ruleForm.dateRange" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
        :default-value="[new Date(2010, 9, 1), new Date(2010, 10, 1)]" />
    </el-form-item>

    <el-form-item>
      <el-upload class="upload-demo" :show-file-list="false" action="http://127.0.0.1:8004/table/uploadExcel" multiple>
        <el-button type="primary">上传表格</el-button>
      </el-upload>
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="resetForm(ruleFormRef)">清除</el-button>
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
import { SelectBill, GetBillTypeList, GetBillDateList, DeleteBillRow } from '@/js/api/billApi';
import { ElMessage, ElMessageBox, TableV2SortOrder, ElButton } from 'element-plus';

// import type { UploadProps, UploadUserFile, FormInstance, Column, } from 'element-plus';
import type { UploadProps, UploadUserFile, FormInstance, Column, } from 'element-plus';

import HelloWorld from '@/components/HelloWorld.vue';


const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })

}
//上传组件

//表格
const dialogVisible = ref(false)
const rowData = ref("")
//平均每笔消费
const priceAvg = ref();
//消费总额
const priceSum = ref();
//表头
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
    title: '操作',
    cellRenderer: (row) => (
      <>
        <ElButton size="small" >Edit</ElButton>
        <ElButton size="small" onClick={handleDelete.bind(this, row)} type="danger">
          删除
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
//form表单结构
const ruleForm = reactive({
  name: '',
  date: '',
  dateRange: '',
  billTypes: [],
});
//请求表格数据参数
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

const handleDelete = ((row: any) => {
  dialogVisible.value = true
  rowData.value = row.rowData

  // console.log(row)
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
const DeleteData = (rowData: string) => {
  dialogVisible.value = false
  DeleteBillRow(rowData).then(() => {
    getBillData(param)
  })
}
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

.dialog-footer button:first-child {
  margin-right: 10px;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>

