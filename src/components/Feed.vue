<template lang="pug">
  .text-center(:class='{hidden: !isWebcamOn}').mt-2
    p(ref='feedWrap')
      canvas.flip-h(ref='feed')
      v-btn(color='primary' @click='stopFeed') Stop Webcam
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'

export default {
  computed: mapState([
    'isWebcamOn',
    'isTracking',
    'lastFrame',
    'refs'
  ]),

  watch: {
    lastFrame () { if (this.refs.webcam && this.refs.feed) this.refs.feed.getContext('2d').drawImage(this.refs.webcam, 0, 0, this.refs.feed.width, this.refs.feed.height) }
  },

  mounted () {
    this.$store.commit('merge', ['refs', {feed: this.$refs.feed}])
    this.resizeFeed()
    window.addEventListener('resize', this.resizeFeed)
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
    }, 50, {leading: true})
  }
}
</script>
