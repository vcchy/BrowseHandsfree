import Vue from 'vue'
import Router from 'vue-router'
import Sketch from '@/experiments/Sketch'
import Typing from '@/experiments/Typing'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Sketch',
      component: Sketch
    },
    {
      path: '/typing',
      name: 'Typing',
      component: Typing
    }
  ]
})
