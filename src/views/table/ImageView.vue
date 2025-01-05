<template>
  <div class="demo-image__lazy">
    <el-image v-for="url in urls" :key="url" :src="url"  />
  </div>
</template>

<script lang="ts">
import {GetImageList} from "@/js/api/imageApi"
import router from "@/router"
import { ref } from 'vue'

export default {
    created () {

        var id = this.$route.params.id
 console.log()
GetImageList(id).then((res:any) => {

    this.urls = res
})
    },
        data() {
      return {
        urls: []
        
      }
    }
}


</script>

<style scoped>
.demo-image__lazy {
  margin: 0 auto;
  height: 100%;
  width: 50%;
  overflow-y: auto;
}
.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}
.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}
</style>