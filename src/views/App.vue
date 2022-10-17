<template>
  <div class="common-layout">
    <el-container class="layout-container-demo" style="height: 100%;">
      <el-header style="text-align: right; font-size: 24px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px" color="#fff" size="24px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-scrollbar>
            <el-menu :default-openeds="['1']" unique-opened router default-active="4">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <message />
                  </el-icon>Navigator One
                </template>
                <el-menu-item-group>
                  <template #title>Group 1</template>
                  <el-menu-item index="1-1">Option 1</el-menu-item>
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
              <el-menu-item index="4">
                <template #title>
                  <el-icon>
                    <Tickets />
                  </el-icon>数据表格
                </template>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
// import { ref } from "vue";
// import { Menu as IconMenu, Message, Setting, Memo } from "@element-plus/icons-vue";
// 数据
// const item = {
//   date: "2016-05-02",
//   name: "Tom",
//   address: "No. 189, Grove St, Los Angeles",
// };
// const tableData = ref(Array.from({ length: 20 }).fill(item));
</script>

<style >
/* html页面占比100% */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}

.el-menu {
  --el-menu-bg-color: #545c64;
  --el-menu-hover-bg-color: #0681fc;
  --el-menu-active-color: #ffd04b;
  --el-menu-item-font-size: 15px;
  --el-menu-text-color: #fff;
}

/* 容器布局占比100% */
.common-layout {
  height: 100%;
}

.layout-container-demo .el-header {
  position: relative;
  background-color: #545c64;
  color: #fff;
}

.aside {
  background-color: #545c64;

}

.layout-container-demo .el-aside {
  background: #545c64;
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>