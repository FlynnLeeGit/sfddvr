// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {
  Button,
  MessageBox,
  Message,
  Dialog,
  Select,
  Option,
  Notification
} from 'element-ui'
import App from './App'
import router from './router'
import * as filters from './plugins/filters'

Vue.config.productionTip = false

Vue.prototype.$aframeUtils = window.AFRAME.utils

Object.keys(filters).forEach(k => {
  Vue.filter(k, filters[k])
})

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
