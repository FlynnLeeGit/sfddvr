import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'

Vue.use(Router)

const routes = [
  {
    path: '/scene/:id',
    name: 'vr.scene',
    title: 'vr场景',
    component: index
  },
  {
    path: '/inspiration/:id/vr',
    name: 'inspiration.vr',
    component: index
  }
]

const router = new Router({
  mode: 'history',
  base: '/virtual_reality/',
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

export default router
