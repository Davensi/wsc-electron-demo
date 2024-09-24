// import HomeView from '@renderer/pages/home/index.vue'
import Layout from '@renderer/layout/main.vue'
import D301 from '@renderer/pages/test/d3/02.vue'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/', component: Layout,
    name: 'layout',
    children: [
      {
        path: '/d3/01',
        name: 'd301',
        component: D301,
      },
    ]
  },
  // { path: '/about', component: AboutView },
]

export {
  routes
}