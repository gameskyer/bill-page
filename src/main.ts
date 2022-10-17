import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import axios from 'axios';
// axios.defaults.baseURL = 'http://127.0.0.1:8004/';
axios.defaults.baseURL = '/api';

const app = createApp(App).use(router);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
app.use(ElementPlus);
app.mount('#app');
