import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/player',
    name: 'Player',
    component: () => import(/* webpackChunkName: "about" */ '../views/VrPlayer.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path: '/roller',
  //   name: 'Roller',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Roller.vue')
  // },
  // {
  //   path: '/video',
  //   name: 'Video',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Video.vue')
  // },
  // {
  //   path: '/player',
  //   name: 'Player',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/VideoPlayer.vue')
  // },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
  // },
  // {
  //   path: '/svg',
  //   name: 'Svg',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/svg.vue')
  // },
  // {
  //   path: '/ui',
  //   name: 'ui',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Ui.vue')
  // },
  // {
  //   path: '/vr-player',
  //   name: 'vrPlayer',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/VrPlayer.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
