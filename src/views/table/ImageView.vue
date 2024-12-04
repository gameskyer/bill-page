<!-- User.vue -->
<template>
    <div>
        User {{ $route.params.id }}
    </div>
  </template>

<script lang="ts">
import {GetImageList} from "@/js/api/imageApi"
import router from "@/router"
import { ref } from 'vue'

export default {
    setup () {
        const images  = ref([])
var vm = this
console.log(this)
console.log(vm.$route.params.id)
GetImageList("vgjDqtOvYB").then((res:any) => {
    images.value = res
    console.log(images.value)
})
    }
}


</script>