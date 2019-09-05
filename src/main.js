import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
import VueRouter from 'vue-router'
import router from '@/router/router'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)
router.beforeEach((to, from, next) => {
  let mytoken = localStorage.getItem('itcast_sp_manager')
  if (mytoken || to.path === '/login') {
    next()
  } else {
    next({ name: 'login' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
