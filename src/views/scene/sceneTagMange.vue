<template>
	<el-form
		:inline="true"
		class="demo-form-inline"
	>
    <el-form-item>
			<el-button  type="success"  >新增 <el-icon class="el-icon--right"><CirclePlus /></el-icon></el-button>
      <el-button  type="danger"  @click="deleteTag">删除所选 <el-icon class="el-icon--right"><Delete /></el-icon></el-button>
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

</template>

<script lang="tsx" setup>
import { ref, unref, reactive } from 'vue';
import { ElCheckbox, ElMessage } from 'element-plus';
import { GetSceneTagList } from '@/js/api/imageApi'
import type { FunctionalComponent } from 'vue';
import type { CheckboxValueType, Column } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { CirclePlus, Delete } from '@element-plus/icons-vue';



const columns: Column<any>[] = [
  {
    dataKey: 'id',
    key: 'id',
    title: 'No.',
    width: 150,
  },
  {
    dataKey: 'tagName',
    key: 'tagName',
    title: '名称',
    width: 150,
  }
]
const tableData = ref<any>([Object]);
GetSceneTagList().then((res) => {
    tableData.value = res;
});

const deleteTag = () => {
	const data = unref(tableData);
	const arr1 = data.filter((row: { checked: boolean }) => {
		return row.checked == true;
	});
	let updataParam: any = new Object();
	let ids = new Array();
	arr1.forEach((obj: any) => {
		ids.push(obj.id);
	});
  console.log(ids)
	// updataParam.id = ids;
	// updataParam.billType = ruleForm.billTypes;
	// if (updataParam.billType == undefined || updataParam.billType == '') {
	// 	ElMessage.error('请选择类型.');
	// 	return;
	// }
	// await UpdateBillType(updataParam).then(() => {
	// 	getBillData(param);
	// });
};

//checkbox组件
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
