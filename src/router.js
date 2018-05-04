import Vue from 'vue'
import Router from 'vue-router'
import Sketch from '@/experiments/Sketch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Sketch',
      component: Sketch
    }
  ]
})
