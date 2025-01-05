<template>
  <div class="common-layout">
    <el-config-provider :locale="zhCn" :button="config">
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
            <Aside />
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-config-provider>
  </div>
</template>
<script lang="ts" setup>
import Aside from '@/main/Aside.vue'
import { computed, ref, reactive } from 'vue'

import { ElConfigProvider } from "element-plus"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn'))
const config = ref({
  autoInsertSpace: true,
})
// 解决ERROR ResizeObserver loop completed with undelivered notifications.
// app.vue写在script里面  main.js写在app挂在完之后
const debounce = (fn, delay) => {
  let timer
   return (...args) => {
     if (timer) {
       clearTimeout(timer)
     }
     timer = setTimeout(() => {
       fn(...args)
     }, delay)
   }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
   constructor(callback) {
     callback = debounce(callback, 200);
     super(callback);
   }
}
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
  --el-menu-bg-color: #303133;
  --el-menu-hover-bg-color: #4b4949;
  --el-menu-active-color: #ffd04b;
  --el-menu-item-font-size: 15px;
  --el-menu-text-color: #fff;
}

.el-main {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

/* 容器布局占比100% */
.common-layout {
  height: 100%;
}

.layout-container-demo .el-header {
  position: relative;
  background-color: #303133;
  color: #fff;
}

.aside {
  background-color: #303133;

}

.layout-container-demo .el-aside {
  background: #303133;
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