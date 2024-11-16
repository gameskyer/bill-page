<template>
  <el-row v-for="(o, index) in 4" :key="o">
    <el-col v-for="(o, index) in 4" :key="o" :span="4" :offset="index > 0 ? 2 : 1" style="width: 100%;">
      <el-card shadow="hover" :body-style="{ padding: '5px', width: '100%'}">
        <el-image style="width: 200px; height: 200px" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" fit="fill" />

        <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image" /> -->
        <div style="padding: 14px">
          <span>Yummy hamburger</span>
          <div class="bottom">
            <el-button text class="button" @click="clickIMG">Operating</el-button>
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
