import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import scene from '@/pages/scene'
import notFound from '@/pages/404'

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
    component: scene
  },
  {
    path: '*',
    title: 'notFound',
    component: notFound
  }
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

export default router
