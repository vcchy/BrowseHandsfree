// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Package from '~/package.json'
import Vue from 'vue'
import App from './App'
import router from './router.js'
import store from './store.js'
import {
  Vuetify,
  VApp,
  VAlert,
  VBtn,
  VCard,
  VDivider,
  VFooter,
  VGrid,
  VIcon,
  VList,
  VNavigationDrawer,
  VProgressCircular,
  VSlider,
  VTextField,
  VToolbar,
  VTooltip,
  transitions
} from 'vuetify'
import '~/node_modules/vuetify/src/stylus/app.styl'
import '@/assets/styles/main.styl'
import '~/node_modules/material-design-icons/iconfont/material-icons.css'
import '~/node_modules/typeface-roboto/index.css'

Vue.use(Vuetify, {
  components: {
    VApp,
    VAlert,
    VBtn,
    VCard,
    VDivider,
    VFooter,
    VGrid,
    VIcon,
    VList,
    VNavigationDrawer,
    VProgressCircular,
    VSlider,
    VTextField,
    VToolbar,
    VTooltip,
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
