<template lang="pug">
  #calibrator(ref='calibrator' :class='{hidden: !isCalibrating}' :style='calibrationStyles')
</template>

<script>
  import { mapState } from 'vuex'
  import lockr from 'lockr'

  const CALIBRATION = {
    // The speed at which the calibrator decreases in size
    SPEED: 5,
    // The speed at which to change the offsets
    STEP: 10,
    // The calibration starting size
    START_SIZE: 100
  }

  export default {
    data () {
      return {
        // The calibrators left position
        left: 0,

        // The calibrators top position
        top: 0,

        // The calibrators size. This starts at 100 and shrinks
        size: {
          width: 100,
          height: 100
        }
      }
    },

    computed: {
      ...mapState([
        'cursor',
        'isCalibrating',
        'hasCalibrated',
        'settings'
      ]),

      /**
       * Sets the calibrators dimensions
       */
      calibrationStyles () { return `height: ${this.size.height}px; width: ${this.size.width}px; margin-left: ${this.size.width / -2}px; margin-top: ${this.size.height / -2}px; left: ${this.left}px; top: ${this.top}px` }
    },

    watch: {
      isCalibrating (isCalibrating) {
        if (isCalibrating) {
          this.size.width = CALIBRATION.START_SIZE
          this.size.height = CALIBRATION.START_SIZE
          this.calibrate()
          this.$nextTick(this.repositionCalibrator)
          this.$store.commit('set', ['mainPanelTitle', 'Calibrating...'])
        }
      }
    },

    mounted () {
      window.addEventListener('resize', this.repositionCalibrator)
      this.repositionCalibrator()
    },

    destroyed () { window.removeEventListener('resize', this.repositionCalibrator) },

    methods: {
      /**
       * Reposition the calibrator
       */
      repositionCalibrator () {
        this.top = window.innerHeight / 2
        this.left = window.innerWidth / 2
      },

      /**
       * Starts calibrating the cursor, bringing it in closer to the calibrator
       */
      calibrate () {
        let isCalibrated
        let settings = Object.assign({}, this.settings)

        // Update calibration settings
        if (this.isCursorToTheLeft()) settings.offset.x = parseInt(settings.offset.x) + CALIBRATION.STEP
        if (this.isCursorToTheRight()) settings.offset.x = parseInt(settings.offset.x) - CALIBRATION.STEP
        if (this.isCursorAbove()) settings.offset.y = parseInt(settings.offset.y) + CALIBRATION.STEP
        if (this.isCursorBelow()) settings.offset.y = parseInt(settings.offset.y) - CALIBRATION.STEP
        this.$store.commit('set', ['settings', settings])

        // Maybe calibrate and repeat
        this.maybeShrinkCalibrator()
        isCalibrated = !(this.size.width > CALIBRATION.STEP * 4)
        this.$store.commit('set', ['isCalibrating', !isCalibrated])
        isCalibrated && this.$store.commit('set', ['hasCalibrated', isCalibrated])

        if (isCalibrated) {
          lockr.set('settings', this.settings)
          this.$store.commit('set', ['mainPanelTitle', 'Settings'])
        } else {
          requestAnimationFrame(this.calibrate)
        }
      },

      /**
       * Cursor position helpers
       * @param {BOL} withBounds Whether to look for the dead center (false) or the elements bounding box (true)
       */
      isCursorToTheLeft (withBounds) {
        const adjust = withBounds ? this.size.width / 2 : 0
        return this.cursor.position.left < this.left - adjust
      },
      isCursorToTheRight (withBounds) {
        const adjust = withBounds ? this.size.width / 2 : 0
        return this.cursor.position.left > this.left + adjust
      },
      isCursorAbove (withBounds) {
        const adjust = withBounds ? this.size.height / 2 : 0
        return this.cursor.position.top < this.top - adjust
      },
      isCursorBelow (withBounds) {
        const adjust = withBounds ? this.size.height / 2 : 0
        return this.cursor.position.top > this.top + adjust
      },
      isCursorCentered (withBounds) { return !this.isCursorToTheRight(withBounds) && !this.isCursorToTheLeft(withBounds) && !this.isCursorAbove(withBounds) && !this.isCursorBelow(withBounds) },

      /**
       * Maybe shrinks the calibrator as it's being calibrated
       */
      maybeShrinkCalibrator () {
        // Shrink
        if (this.isCursorCentered(true)) {
          if (this.size.width > CALIBRATION.STEP) {
            this.size.width -= CALIBRATION.SPEED
            this.size.height -= CALIBRATION.SPEED
          } else {
            this.size.width = CALIBRATION.START_SIZE
            this.size.height = CALIBRATION.START_SIZE
          }
        // Reset
        } else if (this.size.width > CALIBRATION.STEP) {
          this.size.width = CALIBRATION.START_SIZE
          this.size.height = CALIBRATION.START_SIZE
        }
      }
    }
  }
</script>
