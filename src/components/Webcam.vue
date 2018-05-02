<template lang="pug">
  v-card-text(:class='{hidden: !isMainPanelVisible}').text-xs-center
    video.hidden(ref='webcam' playsinline)
    div.text-xs-left
      slot
    Feed
    div(v-if='!isWebcamOn')
      p
        img(src='static/img/browsehandsfree-logo.png' alt='BrowseHandsfree' height=100)
      p.text-xs-left Welcome to <b>BrowseHandsfree</b>, a platform that lets you browse the web hands-free (via face tracking)! To get started, lets first turn on your webcam.
    div.text-xs-center(v-if='loadingText')
      p {{loadingText}}
      p
        v-progress-circular(indeterminate size=50)
    div(v-if='!isWebcamOn')
      p
        v-btn(@click.stop='toggleWebcam' color='primary')
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
  import Feed from '@/components/Feed'

  export default {
    name: 'Webcam',

    components: {
      Feed
    },

    computed: mapState([
      'brf',
      'brfManager',
      'brfResolution',
      'gesture',
      'isMainPanelVisible',
      'isTracking',
      'isWebcamOn',
      'loadingText',
      'refs'
    ]),

    watch: {
      isWebcamOn () { this.isWebcamOn && this.startWebcam() }
    },

    data () {
      return {
        // Detect whether we support ASM or WASM
        asmSupport: typeof WebAssembly === 'object',

        // The BRF file path
        brfPath: CONFIG.brf.wasmPath,

        // Whether we're running IOS11
        isIOS11: false
      }
    },

    mounted () {
      this.$store.commit('merge', ['refs', {webcam: this.$refs.webcam}])
    },

    methods: {
      toggleWebcam () { this.$store.commit('flip', 'isWebcamOn') },

      startWebcam () {
        this.$store.commit('set', ['loadingText', 'Warming up webcam...'])
        this.$store.commit('set', ['lastFrame', Math.random()])
        this.$nextTick(() => {
          navigator.mediaDevices.getUserMedia({video: true, audio: false})
          .then((stream) => {
            this.refs.webcam.srcObject = stream
            this.$store.commit('set', ['isWebcamOn', true])
            this.$store.dispatch('drawLoop')

            // Start tracking on IOS11
            if (this.isIOS11 && this.isTracking) this.trackFaces()

            this.initBRF()
          })
        })
      },

      /**
       * Initialize our facetracking library
       */
      initBRF () {
        this.$store.commit('set', ['loadingText', 'Fetching AI...'])
        this.asmSupport && this.testSafariWebAssemblyBug()
        this.setIsIOS11()
        this.injectBRF()
        this.startLoadingBRF()
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
       * Loads the correct BRF file, based on web assembly support
       */
      injectBRF () {
        const script = document.createElement('script')
        script.setAttribute('src', this.brfPath + CONFIG.brf.filename)
        script.setAttribute('async', true)
        script.setAttribute('type', 'text/javascript')
        document.getElementsByTagName('head')[0].appendChild(script)
      },

      /**
       * Starts loading the SDK file
       */
      startLoadingBRF () {
        // on iOS we want to close the video stream first and
        // wait for the heavy BRFv4 initialization to finish.
        // Once that is done, we start the stream again.
        // Otherwise the stream will just stop and won't update anymore.
        if (this.isIOS11) {
          this.refs.webcam.pause()
          this.refs.webcam.srcObject.getTracks().forEach(track => track.stop())
        }

        this.$store.commit('set', ['loadingText', 'Waking up AI...'])
        this.waitForSDK()
      },

      /**
       * Waits for the SDK to get loaded before starting it
       */
      waitForSDK () {
        // Setup BRF config
        if (this.brf === null && window.initializeBRF) {
          let me = this
          this.$store.commit('set', ['brf', {locateFile (filename) { return me.brfPath + filename }}])
          window.initializeBRF(this.brf)
        }

        // Start initialize SDK
        if (this.brf && this.brf.sdkReady) {
          this.initSDK()
        } else {
          return setTimeout(this.waitForSDK, 100)
        }
      },

      /**
       * Initialize the SDK
       */
      initSDK () {
        this.$store.commit('set', ['brfResolution', new this.brf.Rectangle(0, 0, this.refs.feed.width, this.refs.feed.height)])
        this.$store.commit('set', ['brfManager', new this.brf.BRFManager()])
        this.$store.dispatch('initBRFManager')

        // Start the camera (if on IOS11 or just start tracking)
        if (this.isIOS11) {
          setTimeout(() => this.startWebcam, 2000)
        } else {
          this.$store.commit('set', ['isTracking', true])
          this.trackFaces()
        }

        this.$store.commit('set', ['loadingText', null])
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
      },

      /**
      * Draws all the vertices for a given face
      *
      * @param  {OBJ} face The face object to draw vertices for
      */
      drawVertices (face) {
        const context = this.refs.feed.getContext('2d')
        let color = this.gesture.click * 255

        context.strokeStyle = `rgba(255, ${color}, 0, .75)`

        for (let i = 0; i < face.vertices.length; i += 2) {
          context.beginPath()
          context.arc(face.vertices[i], face.vertices[i + 1], 2, 0, 2 * Math.PI)
          context.stroke()
        }

        this.$store.commit('set', ['lastFace', {
          face,
          time: new Date()
        }])
      },

      /**
      * Draws the triangles connecting vertices
      *
      * @param  {OBJ} face The face object to draw vertices for
      */
      drawTriangles (face) {
        const context = this.refs.feed.getContext('2d')
        const tris = face.triangles
        const verts = face.vertices
        let color = this.gesture.click * 255

        context.strokeStyle = `rgba(255, ${color}, 0, .15)`

        for (let i = 0; i < tris.length; i++) {
          let tri = [tris[i], tris[i + 1], tris[i + 2]]
          let x = [verts[tri[0] * 2], verts[tri[1] * 2], verts[tri[2] * 2]]
          let y = [verts[tri[0] * 2 + 1], verts[tri[1] * 2 + 1], verts[tri[2] * 2 + 1]]

          context.beginPath()
          context.moveTo(x[0], y[0])
          context.lineTo(x[1], y[1])
          context.lineTo(x[2], y[2])
          context.lineTo(x[0], y[0])
          context.stroke()
        }
      }
    }
  }
</script>
