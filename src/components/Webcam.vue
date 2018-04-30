<template lang="pug">
  div
    video.hidden(ref='webcam' playsinline)
    v-card-text(v-if='isMainPanelVisible').text-xs-center
      p
        img(src='@/assets/browsehandsfree-logo.png' alt='BrowseHandsfree' height=100)
      p.text-xs-left Welcome to <b>BrowseHandsfree</b>, a platform that lets you browse the web hands-free (via face tracking)! To get started, lets first turn on your webcam.
      p
        v-btn(@click.stop='startWebcam' color='primary')
          v-icon.mr-2 videocam
          | Start Webcam
      p
        small - or -
      p
        router-link(to='about') Learn more
</template>

<script>
  import { mapState } from 'vuex'
  import CONFIG from '@/config.json'

  export default {
    name: 'Webcam',

    computed: mapState([
      'brf',
      'brfManager',
      'isMainPanelVisible',
      'refs'
    ]),

    watch: {
      isWebcamOn () { this.isWebcamOn && this.initBRF() }
    },

    data () {
      return {
        // Detect whether we support ASM or WASM
        asmSupport: typeof WebAssembly === 'object',

        // The BRF canvas resolution
        // @SEE https://tastenkunst.github.io/brfv4_docs/
        brfResolution: null,

        // Whether we're running IOS11
        isIOS11: false
      }
    },

    mounted () {
      this.$store.commit('merge', ['refs', {webcam: this.$refs.webcam}])
    },

    methods: {
      startWebcam () {
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
          .then((stream) => {
            this.refs.webcam.srcObject = stream
            this.$store.commit('set', ['isWebcamOn', true])
            this.$store.dispatch('drawLoop')

            if (this.isIOS11) this.trackFaces()
          })
      },

      /**
       * Initialize our facetracking library
       */
      initBRF () {
        this.asmSupport && this.testSafariWebAssemblyBug()
        this.setIsIOS11()
      },

      /**
       * Tests whether we support web assembly on Safari browsers
       * @see https://github.com/brion/min-wasm-fail/blob/master/min-wasm-fail.js
       */
      testSafariWebAssemblyBug () {
        const bin = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 127, 1, 127, 3, 2, 1, 0, 5, 3, 1, 0, 1, 7, 8, 1, 4, 116, 101, 115, 116, 0, 0, 10, 16, 1, 14, 0, 32, 0, 65, 1, 54, 2, 0, 32, 0, 40, 2, 0, 11])
        const mod = new window.WebAssembly.Module(bin)
        const inst = new window.WebAssembly.Instance(mod, {})

        // test storing to and loading from a non-zero location via a parameter.
        // Safari on iOS 11.2.5 returns 0 unexpectedly at non-zero locations
        if (inst.exports.test(4) === 0) this.asmSupport = false

        // Use asmjs if web assembly is not supported
        if (!this.asmSupport) this.brfPath = CONFIG.brf.asmPath
      },

      /**
       * Checks if we are on IOS11
       */
      setIsIOS11 () {
        const ua = window.navigator.userAgent
        this.isIOS11 = (ua.indexOf('iPad') > 0 || ua.indexOf('iPhone') > 0) && ua.indexOf('OS 11_') > 0
      },

      /**
       * Starts tracking faces
       */
      trackFaces () {
        if (!this.isWebcamOn || !this.refs.feed) return

        let faces = null
        let context = this.refs.feed.getContext('2d')

        this.brfManager.update(context.getImageData(0, 0, this.brfResolution.width, this.brfResolution.height).data)
        faces = this.brfManager.getFaces()

        for (let i = 0; i < faces.length; i++) {
          let face = faces[i]
          if (face.state === this.brf.BRFState.FACE_TRACKING_START || face.state === this.brf.BRFState.FACE_TRACKING) {
            this.drawVertices(face)
            this.drawTriangles(face)
          }
        }

        requestAnimationFrame(this.trackFaces)
      }
    }
  }
</script>
