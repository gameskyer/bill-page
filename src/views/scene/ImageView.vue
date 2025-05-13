<template>
  <div 
    v-infinite-scroll="loadMore" 
    infinite-scroll-distance="100"
    class="image-list"
  >
    <div v-for="(img, index) in visibleImages" :key="index" class="image-item">
      <img v-lazy="img" class="lazy-image" />
    </div>
    <div v-if="loading" class="loader-trigger">
      <el-icon><Loading /></el-icon> 加载中...
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElIcon } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router'
import { GetImageList } from "@/js/api/imageApi";

const allImages = ref([])
const route = useRoute()
const id = route.params.id
// console.log(id)
GetImageList(id).then((res) => {
  // console.log(res.data)
  allImages.value = res.data;
});
console.log(allImages)
const visibleImages = ref([]); // 初始化为空数组
const loading = ref(false);
const hasMore = ref(true);

// 监听 allImages 的变化来更新 visibleImages
watch(allImages, (newImages) => {
  visibleImages.value = newImages.slice(0, 20);
  console.log(visibleImages.value)
}, { immediate: true });

const loadMore = () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  setTimeout(() => {
    const newImages = allImages.value.slice(
      visibleImages.value.length,
      visibleImages.value.length + 10 // 每次加载10张
    );

    if (newImages.length === 0) {
      hasMore.value = false;
    } else {
      visibleImages.value = [...visibleImages.value, ...newImages];
    }
    loading.value = false;
  }, 1000);
};
</script>

<style scoped>
.image-list {
  width: 70%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.image-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* border-radius: 8px; */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.image-item:hover {
  transform: scale(1.02);
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loader-trigger {
  width: 100%;
  text-align: center;
  padding: 20px;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>