<template>
	<el-form
		ref="ruleFormRef"
		:inline="true"
		:model="ruleForm"
		class="demo-form-inline"
	>
		<el-form-item label="名称" prop="name">
			<el-input v-model="ruleForm.name" placeholder="请输入查询名称" />
		</el-form-item>
		<el-form-item label="类型" prop="billTypes">
			<el-select
				v-model="ruleForm.billTypes"
				placeholder="请选择类型"
				style="width: 240px"
				collapse-tags
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
		<el-form-item>
			<el-button type="primary" :icon="Search" circle @click="select" />
			<el-button
				type="info"
				:icon="Delete"
				@click="resetForm(ruleFormRef)"
				circle
			/>

			<el-button
				type="success"
				:icon="Check"
				@click="submitFrom"
				circle
			/>
		</el-form-item>
	</el-form>
	<div style="height: 1000px">
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

<script lang="tsx" setup>
import { ref, unref, reactive } from 'vue';
import { ElCheckbox, ElMessage } from 'element-plus';
import {
	GetNoTypeData,
	GetBillTypeList,
	UpdateBillType,
} from '@/js/api/billApi';
import type { FunctionalComponent } from 'vue';
import type { CheckboxValueType, Column } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { Search, Check, Delete } from '@element-plus/icons-vue';

const total = ref();
const currentPage = ref(1);
const pageSize = ref(100);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
	name: '',
	billTypes: [],
});
const options = ref<any>([]);
const handleSizeChange = (val: number) => {
	param.results = val;
	getBillData(param);
};
const handleCurrentChange = (val: number) => {
	param.page = val;
	getBillData(param);
};

GetBillTypeList().then((res) => {
	let arr = new Array<any>();

	Object.keys(res).forEach((key) => {
		let obj: any = new Object();
		obj.value = res[key].billType;
		obj.label = res[key].billTypeName;

		arr.push(obj);
	});
	options.value = arr;
});

const select = () => {
	getBillData(param);
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	getBillData(param);
};

const submitFrom = async () => {
	const data = unref(tableData);
	const arr1 = data.filter((row: { checked: boolean }) => {
		return row.checked == true;
	});
	let updataParam: any = new Object();
	let ids = new Array();
	arr1.forEach((obj: any) => {
		ids.push(obj.id);
	});
	updataParam.id = ids;
	updataParam.billType = ruleForm.billTypes;
	if (updataParam.billType == undefined || updataParam.billType == '') {
		ElMessage.error('请选择类型.');
		return;
	}
	await UpdateBillType(updataParam).then(() => {
		getBillData(param);
	});
};

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
];
const tableData = ref<any>([Object]);
const param = reactive({
	results: pageSize.value,
	page: currentPage.value,
	data: ruleForm,
});
getBillData(param);
function getBillData(param: any) {

	GetNoTypeData(param).then((res: any) => {
		total.value = res.total;
		res.bill.forEach((element: any) => {
			element.checked = false;
		});
		tableData.value = res.bill;
	});
}

type SelectionCellProps = {
	value: boolean;
	intermediate?: boolean;
	onChange: (value: CheckboxValueType) => void;
};

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
	value,
	intermediate = false,
	onChange,
}) => {
	return (
		<ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate}/>
	);
};

columns.unshift({
	key: 'selection',
	width: 50,
	cellRenderer: ({ rowData }) => {
		const onChange = (value: CheckboxValueType) =>
			(rowData.checked = value);
		return <SelectionCell value={rowData.checked} onChange={onChange} />;
	},

	headerCellRenderer: () => {
		const _data = unref(tableData);
		const onChange = (value: CheckboxValueType) =>
			(tableData.value = _data.map(
				(row: { checked: string | number | boolean }) => {
					row.checked = value;
					return row;
				}
			));
		const allSelected = _data.every(
			(row: { checked: string | number | boolean }) => row.checked
		);
		const containsChecked = _data.some(
			(row: { checked: string | number | boolean }) => row.checked
		);
		return (
			<SelectionCell
				value={allSelected}
				intermediate={containsChecked && !allSelected}
				onChange={onChange}
			/>
		);
	},
});
</script>
