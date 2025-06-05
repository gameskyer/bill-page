<template>
  <div class="container">
    <!-- 主内容区 -->
    <div class="main-layout">
      <!-- 左侧封面区 -->
      <div class="left-panel">
        <el-card class="cover-card">
          <div class="cover-placeholder">
            <el-image :key="scene.cover" :src="scene.cover" />
          </div>
        </el-card>
      </div>

      <!-- 右侧内容区 -->
      <div class="right-panel">
        <!-- 标题 -->
        <h1 class="title">{{ scene.scene }}</h1>

        <!-- 作者信息 -->
        <div class="author-section">
          <el-divider content-position="left">作者</el-divider>
          <el-text type="info">{{ scene.author }}</el-text>
        </div>

        <!-- 标签区域 -->
        <div class="tags-section">
          <el-divider content-position="left">标签</el-divider>
          <div class="tags-group">
            <el-tag
              v-for="(tag) in scene.tag"
              :key="tag.id"
              type="info"
              class="tag-item"
            >
              {{ tag.tagName }}
            </el-tag>
          </div>
        </div>

        <!-- 分集列表 -->
        <el-divider content-position="left">分集列表</el-divider>
        <div
          class="scrollable-episodes"
          :style="{ height: `${containerHeight}px` }"
          @scroll="handleScroll"
        >
          <div class="episode-list">
            <el-card
              v-for="(episode, index) in scene.childScene"
              :key="index"
              class="episode-item"
              shadow="hover"
              @click="clickIMG(episode.id)"
            >
              <el-text >{{ episode.childSceneName }}</el-text>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const containerHeight = ref(400);
const clickIMG = (id) => {
  console.log(id)
  router.push({ path: '/imageView/'+id })
}

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  if (scrollHeight - scrollTop - clientHeight < 50) {
  }
};
</script>


<script>
import { GetSceneContent } from "@/js/api/imageApi";
import router from "@/router";

export default {
  created() {
    var id = this.$route.params.id;
    console.log();
    GetSceneContent(id).then((res) => {
      this.scene = res.data;
    });
  },
  data() {
    return {
      scene: [],
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

.main-layout {
  display: flex;
  gap: 40px;
}

.left-panel {
  flex: 0 0 400px;
}

.right-panel {
  flex: 1;
}

.title {
  margin: 0 0 20px 0;
  font-size: 2.2rem;
  color: #303133;
}

.cover-card {
  margin-bottom: 0;
}

.cover-placeholder {
  height: 500px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.author-section {
  margin: 0 0 25px 0;
  font-size: 1.1rem;
  color: #606266;
}

.tags-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

/* 新增滚动容器样式 */
.scrollable-episodes {
  height: 400px; /* 固定高度 */
  overflow-y: auto; /* 垂直滚动 */
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 10px;
  margin-top: 10px;
}

/* 修改原有分集列表样式 */
.episode-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: min-content; /* 保持内容高度 */
}

/* 滚动条样式美化 */
.scrollable-episodes::-webkit-scrollbar {
  width: 8px;
}

.scrollable-episodes::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.scrollable-episodes::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

.scrollable-episodes::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .scrollable-episodes {
    height: 300px; /* 移动端适当降低高度 */
  }
}
/* 响应式设计 */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }

  .left-panel {
    flex: none;
    width: 100%;
  }

  .cover-placeholder {
    height: 300px;
  }
}

.episode-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.episode-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
}
</style>