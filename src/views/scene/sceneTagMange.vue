<template>
	<el-form :inline="true" class="demo-form-inline">
		<el-form-item>
			<el-button type="success" @click="openAddDialog()">新增 <el-icon class="el-icon--right">
					<CirclePlus />
				</el-icon></el-button>
			<el-button type="danger" @click="openDeletDialog()">删除所选 <el-icon class="el-icon--right">
					<Delete />
				</el-icon></el-button>
		</el-form-item>
	</el-form>

	<!--弹出框-->
	<el-dialog v-model="dialog.dialogFormVisible" :title="dialog.title" width="500" :center="dialog.isCenter">
		<el-form :model="form">
			<el-form-item v-show="dialog.dialogInputVisible" label="TAG名称" :label-width="dialog.formLabelWidth">
				<el-input v-model="form.name" autocomplete="off" />
			</el-form-item>
		</el-form>
		<div id="deletPrompt" v-show="dialog.showSpan">
			<span >
				是否确定删除所选数据？
			</span>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDialog()">取消</el-button>
				<el-button type="primary" v-show="dialog.submit" @click="submitForm()">
					确认
				</el-button>
				<el-button type="primary" v-show="dialog.update" @click="submitUpdateForm()">
					更新
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

<style scoped>
#deletPrompt {
	text-align: center;
}
</style>
<script lang="tsx" setup>
import { ref, unref, reactive } from 'vue';
import { ElCheckbox, ElMessage, ElButton } from 'element-plus';
import { GetSceneTagList, DeleteSceneTag, AddSceneTag,UpdateSceneTag } from '@/js/api/imageApi'
import type { FunctionalComponent } from 'vue';
import type { CheckboxValueType, Column } from 'element-plus';
import { CirclePlus, Delete } from '@element-plus/icons-vue';


const submitUpdateForm = () =>{
	let formData = {
		id: form.id,
		tagName: form.name
	}
	UpdateSceneTag(formData).then((ref: any) => {
		if (ref.code == 0) {
			ElMessage.success(ref.message);
			SceneList();
			form.name = '';
			form.id = 0;
			closeDialog()
			return;
		}
		if (ref.code != 0) {
			ElMessage.error(ref.message);
			form.name = '';
			form.id = 0;
			closeDialog()
			return;
		}
	})
}

const submitForm = () =>{
	//如果弹窗是新增，且输入框不为空，则执行新增操作
	if (dialog.dialogInputVisible && form.name != '') {
		insertTag()
	}else if(numbers.length > 0){
		deleteTag()
	}
	else{
		deleteTagList()
	}
}
//弹窗事件
const dialog = reactive({
	dialogFormVisible: false,
	dialogInputVisible: true,
	title: '新增TAG',
	isCenter: false,
	formLabelWidth: '140px',
	showSpan: false,
	update: false,
	submit:true,
});
//批量删除弹窗
const openDeletDialog = () => {
	dialog.dialogFormVisible = true;
	dialog.dialogInputVisible = false;
	dialog.title = '删除所选';
	dialog.isCenter = true;
	dialog.showSpan = true;
	dialog.update = false;
	dialog.submit = true;
};
//新增弹窗
const openAddDialog = () => {
	dialog.dialogFormVisible = true;
	dialog.dialogInputVisible = true;
	dialog.title = '新增TAG';
	dialog.isCenter = false;
	dialog.showSpan = false;
	dialog.update = false;
	dialog.submit = true;
};
//关闭弹窗
const closeDialog = () => {
	dialog.dialogFormVisible = false;
	if(numbers.length > 0){
		numbers = []
	}
	if (form.name != '') {
		form.name = ''
		form.id = 0;
	}
};
//删除单条记录弹出
const openDeleteDialogSingle = (row: any) => {
	dialog.dialogFormVisible = true;
	dialog.dialogInputVisible = false;
	dialog.title = '删除所选';
	dialog.isCenter = true;
	dialog.showSpan = true;
	dialog.update = false;
	dialog.submit = true;
	numbers.push(row.id);
};

//弹出更新框
const openUpdateDialogSingle = (row: any) => {
	dialog.dialogFormVisible = true;
	dialog.dialogInputVisible = true;
	dialog.title = '修改TAG';
	dialog.isCenter = false;
	dialog.showSpan = false;
	dialog.update = true;
	dialog.submit = false;
	form.name = row.tagName;
	form.id = row.id;
};


const form = reactive({
	name: '',
	id: 0,
})
const insertTag = () => {
	AddSceneTag(form.name).then((ref: any) => {
		if (ref.code == 0) {
			ElMessage.success(ref.message);
			SceneList();
			form.name = '';
			return;
		}
		if (ref.code != 0) {
			ElMessage.error(ref.message);
			return;
		}
	})
	closeDialog()
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
	},
	{
		key: 'operations',
		title: '操作',
		cellRenderer: ({ rowData }) => (
			<>
				<ElButton size="small" onClick={() => openUpdateDialogSingle(rowData)}>
					修改</ElButton>
				<ElButton size="small" type="danger" onClick={() => openDeleteDialogSingle(rowData)}>
					删除
				</ElButton>
			</>
		),
		width: 150,
		align: 'center',
	},
]

const tableData = ref<any>([Object]);
SceneList();

function SceneList() {
	GetSceneTagList().then((res: any) => {
		tableData.value = res.data;
		if (res.code != 0) {
			ElMessage.error(res.message);
			return;
		}
		if (res.data.length == 0) {
			ElMessage.info('暂无数据');
			return;
		}
		
	});
}

let numbers: number[] = [];

const deleteTag = () => {
	DeleteSceneTag(numbers).then((res: any) => {
		closeDialog()
		numbers = [];
		if (res.code == 0) {
			ElMessage.success(res.message);
			SceneList();
			return;
		}
		if (res.code != 0) {
			ElMessage.error(res.message);
			return;
		}
	});

}

const deleteTagList = () => {
	const data = unref(tableData);
	const arr1 = data.filter((row: { checked: boolean }) => {
		return row.checked == true;
	});
	arr1.forEach((obj: any) => {
		numbers.push(obj.id);
	});
	if (numbers.length == 0) {
		ElMessage.warning('请至少选择一条数据');
		return;
	}
	DeleteSceneTag(numbers).then((res: any) => {
		closeDialog()
		numbers = [];
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
