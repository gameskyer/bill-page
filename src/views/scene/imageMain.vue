<template>
  <!-- <el-row v-for="(o) in 4" :key="o"> -->
  <el-space wrap :size="70">
    <el-card v-for="i in sences.length" :key="i" class="box-card" :span="4" :offset="i > 0 ? 2 : 1" style="width: 250px;" @click="clickIMG(sences[i-1].id)">
      <el-image style="width: 200px; " :src=sences[i-1].cover fit="fill" />
      <div style="padding: 14px">
        <span>{{sences[i-1].scene}}</span>
        <!-- <div class="bottom">
          <el-button text class="button" >Operating</el-button>
        </div> -->
      </div>
    </el-card>
   

  </el-space>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import {GetImageSence} from "@/js/api/imageApi"
import router from "@/router"
const clickIMG = (id:string) => {
  router.push({ path: '/imageContent/'+id })
  console.log(id)
}
interface Scene {
  id: string;
  cover: string;
  scene: string;
}

const sences = ref<Scene[]>([])
GetImageSence().then((res:any) => {
  sences.value = res.data
})
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
    height: 100%;
    display: block;
  }
  </style>
  