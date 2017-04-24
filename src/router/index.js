import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/scene/:id',
    name: 'vr.scene',
    title: 'vr场景',
    component: index
  },
  {
    path: '/inspirations/:id/vr',
    name: 'inspiration.vr',
    component: index
  }
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  base: '/virtual_reality/',
  routes
})

export default router
