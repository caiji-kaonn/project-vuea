// 这里做路由的配置
import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '@/views/login'
import home from '@/views/home'
import welcome from '@/views/welcome'
import users from '@/views/user/user'
import goods from '@/views/goods/goods'
import lits from '@/views/goods/lits'
import add from '@/views/goods/add'
import roleList from '@/views/rights/rolelist'
import rightList from '@/views/rights/rightList'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }

    },
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'home',
      path: '/home',
      component: home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: welcome
        },
        {
          name: 'users',
          path: 'users',
          component: users
        },
        {
          name: 'roles',
          path: 'roles',
          component: roleList
        },
        {
          name: 'rights',
          path: 'rights',
          component: rightList
        }, {
          name: 'goods',
          path: 'goods',
          component: goods,
          redirect: { name: 'lits' },
          children: [
            {
              name: 'lits',
              path: 'lits',
              component: lits
            },
            {
              name: 'add',
              path: 'add',
              component: add
            }
          ]
        }
      ]
    }
  ]
})
