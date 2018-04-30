import Vue from 'vue'
import Vuex from 'vuex'
import { merge } from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // The BRF Object
    brf: null,

    // The BRF Manager
    brfManger: null,

    // The panel inside the app's main extended toolbar
    isMainPanelVisible: true,

    isWebcamOn: false,

    // The last requestAnimationFrame reference
    lastFrame: null,

    // App-wide refs
    refs: {
      webcam: null,
      feed: null
    }
  },

  mutations: {
    /**
     * Sets a state with key to a value
     *
     * @param {OBJ} state
     * @param {STR} payload Must be in form [key, value]
     */
    set (state, [key, value]) { state[key] = value },

    /**
     * Flips the truthyness of a variable
     *
     * @param {OBJ} state
     * @param {STR} key The key to flip
     */
    flip (state, key) { state[key] = !state[key] },

    /**
     * Merges values into a state with key
     * @param {OBJ} state
     * @param {STR} payload Must be in form [key, value]
     */
    merge (state, [key, values]) { state[key] = merge(state[key], values) }
  },

  actions: {
    /**
     * Our main draw loop. Note: Watch the `lastFrame` state in order to paint
     */
    drawLoop ({dispatch, commit}) {
      commit('set', ['lastFrame', requestAnimationFrame(() => {
        dispatch('drawLoop')
      })])
    }
  }
})
