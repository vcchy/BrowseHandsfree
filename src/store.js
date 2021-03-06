import Vue from 'vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import lockr from 'lockr'

Vue.use(Vuex)

let settings = lockr.get('settings') || {}
settings = merge({
  cursor: {
    size: 15,

    // Number of frames a click is active for
    clickFrameBuffer: 1
  },

  offset: {
    x: 0,
    y: 0
  },

  click: {
    sensitivity: 1.46
  },

  scroll: {
    sensitivity: 0.8
  },

  typing: {
    speed: 20
  },

  speed: {
    x: 1,
    y: 1
  }
}, settings)

export default new Vuex.Store({
  state: {
    // The BRF Object
    brf: null,

    // The BRF Manager
    brfManager: null,

    // The BRF canvas resolution
    // @SEE https://tastenkunst.github.io/brfv4_docs/
    brfResolution: null,

    // The chrome background page
    chromeBgPage: null,

    // The cursor object
    cursor: {
      position: {
        left: 0,
        top: 0
      },
      isDown: false,
      clicked: false,
      framesSinceClicked: 0
    },

    // Whether we are currently calibrating
    isCalibrating: false,

    // Whether we have calibrated or not
    hasCalibrated: false,

    // Different gesture confidences
    gesture: {
      click: 0
    },

    // The panel inside the app's main extended toolbar
    isMainPanelVisible: true,

    // Whether we are tracking faces or not
    isTracking: false,

    // Whether the webcam is on or not
    isWebcamOn: false,

    // Whehter the feed itself is visible
    isFeedVisible: false,

    // The last face object discovered
    // There are listeners on this object (@see Pointer.vue)
    lastFace: null,

    // The last requestAnimationFrame reference
    lastFrame: null,

    // Loading text (or null)
    loadingText: null,

    // The title used on the main panel
    mainPanelTitle: 'Start Here',

    // App-wide refs
    refs: {
      webcam: null,
      feed: null,
      pointer: null
    },

    settings
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
    },

    /**
     * Opens closes the panel based on the camera state
     */
    maybeTogglePanel ({state}) { state.isMainPanelVisible = !state.isWebcamOn },

    /**
     * Initializes the manager
     */
    initBRFManager ({state}) { state.brfManager && state.brfManager.init(state.brfResolution, state.brfResolution, 'com.browsehandsfree') },

    /**
     * Sets the click states
     */
    updateClick ({state}) {
      if (state.cursor.isDown) state.cursor.framesSinceClicked++

      // Clicked and held, so release the "clicked"
      if (state.cursor.clicked && state.cursor.isDown && state.cursor.framesSinceClicked > state.settings.cursor.clickFrameBuffer) { state.cursor.clicked = false }

      // Just Clicked
      if (state.gesture.click === 1 && !state.cursor.isDown && !state.cursor.clicked) {
        state.cursor.isDown = true
        state.cursor.clicked = true
        state.cursor.framesSinceClicked = 0
      }

      if (state.gesture.click !== 1) {
        state.cursor.isDown = false
        state.cursor.clicked = false
      }
    }
  }
})
