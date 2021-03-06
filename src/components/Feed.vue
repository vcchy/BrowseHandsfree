<template lang="pug">
  .text-center(:class='{hidden: !isWebcamOn}').mt-2
    p(ref='feedWrap')
      canvas.flip-h(ref='feed' :class='{hidden: !isFeedVisible}')
      v-btn(v-if='!isFeedVisible' color='info' @click='toggleFeed')
        v-icon.mr-2 visibility
        | Show Feed
      v-btn(v-else color='info' @click='toggleFeed')
        v-icon.mr-2 visibility_off
        | Hide Feed
      v-btn(v-if='isTracking' color='primary' @click='calibrate')
        v-icon.mr-2 gps_fixed
        | Calibrate
      v-btn(color='error' @click='stopFeed')
        v-icon.mr-2 videocam_off
        | Stop Webcam
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'

export default {
  computed: mapState([
    'hasCalibrated',
    'isTracking',
    'isWebcamOn',
    'isFeedVisible',
    'lastFrame',
    'refs'
  ]),

  watch: {
    // Draw the webcam frame
    lastFrame () { this.refs.webcam && this.refs.feed && this.refs.feed.getContext('2d').drawImage(this.refs.webcam, 0, 0, this.refs.feed.width, this.refs.feed.height) },

    // Revert the title to "Start Here"
    isWebcamOn () { !this.isWebcamOn && this.isTracking && this.hasCalibrated && this.$store.commit('set', ['mainPanelTitle', 'Start Here']) }
  },

  mounted () {
    this.$store.commit('merge', ['refs', {feed: this.$refs.feed}])
    this.resizeFeed()
    window.addEventListener('resize', this.resizeFeed)
    window.addEventListener('webkitfullscreenchange', this.resizeFeed)
    window.addEventListener('mozfullscreenchange', this.resizeFeed)
    window.addEventListener('fullscreenchange', this.resizeFeed)
  },

  destroyed () {
    window.removeEventListener('resize', this.resizeFeed)
    window.removeEventListener('webkitfullscreenchange', this.resizeFeed)
    window.removeEventListener('mozfullscreenchange', this.resizeFeed)
    window.removeEventListener('fullscreenchange', this.resizeFeed)
  },

  methods: {
    stopFeed () {
      this.$store.commit('set', ['isWebcamOn', false])
      this.refs.webcam.srcObject.getTracks().forEach(track => track.stop())
    },

    /**
     * Resizes the feed to fit within view
     */
    resizeFeed: debounce(function () {
      if (!this.isWebcamOn || !this.refs.webcam.videoWidth) return this.resizeFeed()

      const $webcam = this.refs.webcam
      const $feed = this.refs.feed
      const $feedWrap = this.$refs.feedWrap
      const width = Math.min($webcam.videoWidth, $feedWrap.clientWidth)
      const aspectRatio = $webcam.videoWidth / $webcam.videoHeight

      $feed.width = width
      $feed.height = width / aspectRatio

      this.$store.dispatch('initBRFManager')
    }, 50, {leading: true}),

    /**
     * Starts the recalibration process
     */
    calibrate () { this.$store.commit('set', ['isCalibrating', true]) },

    toggleFeed () { this.$store.commit('flip', 'isFeedVisible') }
  }
}
</script>
