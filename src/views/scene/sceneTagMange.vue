<template>
	<el-form :inline="true" class="demo-form-inline">
		<el-form-item>
			<el-button type="success" @click="dialogFormVisible = true">新增 <el-icon class="el-icon--right">
					<CirclePlus />
				</el-icon></el-button>
			<el-button type="danger" @click="deleteTag">删除所选 <el-icon class="el-icon--right">
					<Delete />
				</el-icon></el-button>
		</el-form-item>
	</el-form>

	<!--弹出框-->
	<el-dialog v-model="dialogFormVisible" title="新增TAG" width="500">
    <el-form :model="form">
      <el-form-item label="TAG名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="insertTag()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

	<!-- 表格 -->
	<div style="height: 1000px">
		<el-auto-resizer>
			<template #default="{ height, width }">
				<el-table-v2 :columns="columns" :data="tableData" :width="width" :height="height" fixed />
			</template>
		</el-auto-resizer>
	</div>

</template>

<script lang="tsx" setup>
import { ref, unref, reactive } from 'vue';
import { ElCheckbox, ElMessage } from 'element-plus';
import { GetSceneTagList, DeleteSceneTag,AddSceneTag } from '@/js/api/imageApi'
import type { FunctionalComponent } from 'vue';
import type { CheckboxValueType, Column } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { CirclePlus, Delete } from '@element-plus/icons-vue';

//弹窗事件

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  name: '',
})
const insertTag = () =>{
	dialogFormVisible.value = false
	AddSceneTag(form.name)
}

//表格
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
SceneList();

function SceneList() {
	GetSceneTagList().then((res: any) => {
		if (res.code != 0) {
			ElMessage.error(res.message);
			return;
		}
		if (res.data.length == 0) {
			ElMessage.info('暂无数据');
			return;
		}
		tableData.value = res.data;
	});
}


const deleteTag = () => {
	const data = unref(tableData);
	const arr1 = data.filter((row: { checked: boolean }) => {
		return row.checked == true;
	});
	let ids = new Array();
	arr1.forEach((obj: any) => {
		ids.push(obj.id);
	});
	console.log(ids)
	DeleteSceneTag(ids).then((res: any) => {

		if (res.code == 0) {
			ElMessage.success(res.message);
			tableData.value = data.filter((row: { checked: boolean }) => {
				return row.checked == false;
			});
			GetSceneTagList().then((res) => {
				tableData.value = res.data;
			});
			return;
		}
		if (res.code != 0) {
			ElMessage.error(res.message);
			return;
		}

	});
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
		<ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
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
