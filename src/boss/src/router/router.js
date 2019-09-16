import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/Login'
import Show from '../views/Show'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'show',
      component: Show
    }
  ]
})
export default router

router.beforeEach((to, from, next) => {
  next()
})
