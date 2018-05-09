import Vue from 'vue'
import Router from 'vue-router'
import Sketch from '@/experiments/Sketch'
import Dev from '@/views/Dev'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Sketch',
      component: Sketch
    },
    {
      path: '/dev',
      name: 'Dev',
      component: Dev
    }
  ]
})
