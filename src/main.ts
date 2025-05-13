import { createApp } from 'vue';
import VueLazyload from 'vue-lazyload';
import Vue from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import axios from 'axios'
import { AxiosInstance } from 'axios';


// 全局自定义属性
// 图片懒加载
const app = createApp(App).use(router);
app.use(VueLazyload, {
  preLoad: 1.3,
  error: '',
  loading: '',
  attempt: 1
});


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus);
app.mount('#app');
