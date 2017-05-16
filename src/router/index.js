import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'

Vue.use(Router)
import { base } from '../../localConfig'

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/scene/:id',
    name: 'scene.vr',
    component: index
  },
  {
    path: '/inspirations/:id/vr',
    name: 'inspiration.vr',
    component: index
  },
  {
    path: '/share/vr',
    name: 'share.vr',
    component: index
  }
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  base,
  routes
})

export default router
