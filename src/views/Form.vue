<template>
	<el-form
		ref="ruleFormRef"
		:inline="true"
		:model="ruleForm"
		class="demo-form-inline"
	>
		<el-form-item label="名称" prop="user">
			<el-input v-model="ruleForm.user" placeholder="请输入查询名称" />
		</el-form-item>
		<el-form-item label="类型" prop="values">
			<el-select
				v-model="ruleForm.values"
				placeholder="请选择类型(多选)"
				style="width: 240px"
				multiple
				clearable
			>
				<el-option
					v-for="option in options"
					:key="option.value"
					:label="option.label"
					:value="option.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="日期" prop="date">
			<el-select v-model="ruleForm.date" placeholder="日期" clearable>
				<el-option
					v-for="option in options"
					:key="option.value"
					:label="option.label"
					:value="option.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="日期区间" prop="daterange">
			<el-date-picker
				v-model="ruleForm.daterange"
				type="daterange"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				:default-value="[new Date(2010, 9, 1), new Date(2010, 10, 1)]"
			/>
		</el-form-item>

		<el-form-item>
			<el-button type="primary" @click="onSubmit">确认</el-button>
			<el-button @click="resetForm(ruleFormRef)">清除</el-button>
		</el-form-item>
	</el-form>
	<div style="height: 80%">
		<el-auto-resizer>
			<template #default="{ height, width }">
				<el-table-v2
					:columns="columns"
					:data="tableData"
					:width="width"
					:height="height"
					fixed
				/>
			</template>
		</el-auto-resizer>
	</div>
	<el-pagination
		v-model:currentPage="currentPage"
		v-model:page-size="pageSize"
		:page-sizes="[100, 200, 300, 400]"
		:background="true"
		layout="->,total, sizes, prev, pager, next"
		:total="total"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	/>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { SelectBill, GetBillTypeList } from '../js/api/billApi';
//表格

const columns = [
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
	},
];

const total = ref();
const currentPage = ref(1);
const pageSize = ref(100);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
	user: '',
	date: '',
	daterange: '',
	values: [],
});
const param = reactive({
	results: pageSize.value,
	page: currentPage.value,
	data: ruleForm,
});

const tableData = ref([]);
SelectBill(param).then((res) => {
	tableData.value = res.data.bill;
	total.value = res.data.total;
});
//分页

const handleSizeChange = (val: number) => {
	param.results = val;
	SelectBill(param).then((res) => {
		tableData.value = res.data.bill;
	});
};
const handleCurrentChange = (val: number) => {
	param.page = val;
	SelectBill(param).then((res) => {
		tableData.value = res.data.bill;
	});
};
//表单
const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

const options = Array.from({ length: 1000 }).map((_, idx) => ({
	value: `Option ${idx + 1}`,
	label: `${initials[idx % 10]}${idx}`,
}));

const onSubmit = () => {
	console.log(ruleForm.user);
};

const resetForm = (formEl: FormInstance | undefined) => {
	console.log(formEl);
	if (!formEl) return;
	formEl.resetFields();
};
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
