// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Package from '~/package.json'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store.js'
import {
  Vuetify,
  VApp,
  VBtn,
  VCard,
  VDivider,
  VFooter,
  VGrid,
  VIcon,
  VList,
  VToolbar,
  VTooltip,
  VNavigationDrawer,
  VProgressCircular,
  transitions
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'
import '@/assets/styles/main.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VCard,
    VDivider,
    VFooter,
    VGrid,
    VIcon,
    VList,
    VNavigationDrawer,
    VToolbar,
    VTooltip,
    VProgressCircular,
    transitions
  },

  theme: {
    primary: 0xba68c8
  }
})

Vue.config.productionTip = false
Vue.prototype.$version = Package.version

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
