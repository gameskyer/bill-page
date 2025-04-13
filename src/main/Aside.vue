<template>
  <el-scrollbar>
    <el-menu :default-openeds="[]" unique-opened router default-active="4">
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <Tickets />
          </el-icon>数据表格
        </template>
        <el-menu-item-group>
          <template #title>表格</template>
          <el-menu-item index="2-1" route="/table">汇总表格</el-menu-item>
          <el-menu-item index="2-2" route="/noTypeTable">未分类数据</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group 2">
          <el-menu-item index="2-3" route="/imageMain">Option 3</el-menu-item>
          <el-menu-item index="2-4" route="/imageContent">Option 4</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <setting />
          </el-icon>图形
        </template>
        <el-menu-item-group>
          <template #title>饼图</template>
          <el-menu-item index="/cookieImg">分类饼图</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template #title>综合图形</template>
          <el-menu-item index="/compositeImg">综合图</el-menu-item>
        </el-menu-item-group>

      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Aside extends Vue { }
</script>

<style scoped>
.el-menu {
  --el-menu-bg-color: #303133;
  --el-menu-hover-bg-color: #4b4949;
  --el-menu-active-color: #ffd04b;
  --el-menu-item-font-size: 15px;
  --el-menu-text-color: #fff;
}
</style>
