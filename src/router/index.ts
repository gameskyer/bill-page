import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import Home from '../views/Home.vue';

import Table from '../views/table/Table.vue';
import NoTypeTable from '../views/table/NoTableDataTable.vue';
import test from '../views/table/test.vue';
import CompositeImg from '@/views/img/CompositeImg.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/compositeImg',
    name: 'CompositeImg',
    component: CompositeImg,
  },
  {
    path: '/',
    name: 'Home',
    component: Table,
  },
  {
    path: '/cookieImg',
    name: 'CookieImg',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/img/CookieImg.vue'),
  },
  {
    path: '/table',
    name: 'Table',
    component: Table,
  },
  {
    path: '/noTypeTable',
    name: 'NoTypeTable',
    component: NoTypeTable,
  },
  {
    path: '/test',
    name: 'test',
    component: test,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
