import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '@/pages/about/About.vue')
    component: () => import(/* webpackChunkName: "about" */ '@/views/about/index'),
    // import 如果放到pages 目录 就不会代码切割，原因待查
  },
];

const router = new VueRouter({
  // https://router.vuejs.org/zh/guide/essentials/history-mode.html
  // https://cli.vuejs.org/zh/guide/deployment.html#%E6%9C%AC%E5%9C%B0%E9%A2%84%E8%A7%88
  // mode: 'history,
  base: process.env.BASE_URL,
  routes,
});

export default router;
