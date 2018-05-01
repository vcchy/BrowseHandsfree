<template lang="pug">
  #calibrator(ref='calibrator' :class='{hidden: !isTracking || (isTracking && isCalibrated)}' :style='style')
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        left: 0,
        top: 0
      }
    },

    computed: {
      ...mapState([
        'cursor',
        'isCalibrated',
        'isTracking',
        'settings'
      ]),

      style () { return `left: ${this.left}px; top: ${this.top}px` }
    },

    watch: {
      isTracking () {
        if (this.isTracking && !this.isCalibrated) {
          this.calibrate()
          this.repositionCalibrator()
        }
      }
    },

    mounted () {
      window.addEventListener('resize', this.repositionCalibrator)
      this.repositionCalibrator()
    },

    methods: {
      /**
       * Repositions the calibrator
       */
      repositionCalibrator () {
        const $marker = this.$refs.calibrator
        this.left = window.innerWidth / 2 - $marker.offsetWidth
        this.top = window.innerHeight / 2 - $marker.offsetHeight
      },

      /**
       * Starts calibrating the cursor, bringing it in closer to the calibrator
       */
      calibrate () {
        let isCalibrated = true
        let settings = Object.assign({}, this.settings)
        let $marker = this.$refs.calibrator

        if (this.cursor.position.left < this.left - $marker.offsetWidth / 2) {
          settings.offset.x = parseInt(settings.offset.x) + 10
          isCalibrated = false
        }

        if (this.cursor.position.left > this.left + $marker.offsetWidth / 2) {
          settings.offset.x = parseInt(settings.offset.x) - 10
          isCalibrated = false
        }

        if (this.cursor.position.top < this.top - $marker.offsetHeight / 2) {
          settings.offset.y = parseInt(settings.offset.y) + 10
          isCalibrated = false
        }

        if (this.cursor.position.top > this.top + $marker.offsetHeight / 2) {
          settings.offset.y = parseInt(settings.offset.y) - 10
          isCalibrated = false
        }

        this.$store.commit('merge', ['settings', settings])
        this.$store.commit('set', ['isCalibrated', isCalibrated])
        if (!isCalibrated) { requestAnimationFrame(this.calibrate) }
      }
    }
  }
</script>
