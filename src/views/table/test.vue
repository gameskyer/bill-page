<template>
  <el-row v-for="(o, index) in 2" :key="o">
    <el-col v-for="(o, index) in 5" :key="o" :span="3" :offset="index > 0 ? 2 : 1">
      <el-card shadow="hover" :body-style="{ padding: '10px', width: '100px' }">
        <img src="https://img1.baidu.com/it/u=177648641,3119783561&fm=253&fmt=auto&app=138&f=JPEG?w=150&h=100"
          class="image" />
        <div style="padding: 14px">
          <span>Yummy hamburger</span>
          <div class="bottom">
            <!-- <time class="time">{{ currentDate }}</time> -->
            <el-button text class="button" @click="clickIMG">Operating</el-button>
            <!-- <el-button text class="button">Operating</el-button> -->
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const clickIMG = () => {
  console.log(111)
}

const currentDate = ref(new Date())
</script>

<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>
