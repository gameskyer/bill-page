<template>

  <el-scrollbar>
    <el-menu :default-openeds="[]" unique-opened router default-active="4">
      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <message />
          </el-icon>Navigator One
        </template>
        <el-menu-item-group>
          <template #title>Group 1</template>
          <el-menu-item index="/pageone">Option 1</el-menu-item>
          <el-menu-item index="1-2">Option 2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group 2">
          <el-menu-item index="1-3">Option 3</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title>Option4</template>
          <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <Edit />
          </el-icon>Navigator Two
        </template>
        <el-menu-item-group>
          <template #title>Group 1</template>
          <el-menu-item index="2-1">Option 1</el-menu-item>
          <el-menu-item index="2-2">Option 2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group 2">
          <el-menu-item index="2-3">Option 3</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="2-4">
          <template #title>Option 4</template>
          <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <setting />
          </el-icon>Navigator Three
        </template>
        <el-menu-item-group>
          <template #title>Group 1</template>
          <el-menu-item index="3-1">Option 1</el-menu-item>
          <el-menu-item index="3-2">Option 2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group 2">
          <el-menu-item index="3-3">Option 3</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="3-4">
          <template #title>Option 4</template>
          <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="4" route="/form">
        <template #title>
          <el-icon>
            <Tickets />
          </el-icon>数据表格
        </template>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Aside extends Vue {

}
</script>

<style scoped>
.el-menu {
  --el-menu-bg-color: #545c64;
  --el-menu-hover-bg-color: #2d2e2e;
  --el-menu-active-color: #ffd04b;
  --el-menu-item-font-size: 15px;
  --el-menu-text-color: #fff;
}
</style>