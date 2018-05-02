<template lang="pug">
  #calibrator(ref='calibrator' :class='{hidden: !isCalibrating, horiz: mode === "horiz", vert: mode === "vert"}' :style='calibrationStyles')
</template>

<script>
  import { mapState } from 'vuex'

  const CALIBRATION = {
    // The speed at which the calibrator decreases in size
    SPEED: 5,
    // The speed at which to change the offsets
    CENTER_STEP: 10,
    // The speed to adjust the move sensitivity
    HORIZ_STEP: 0.05,
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
      calibrationStyles () { return `height: ${this.size.height}px; width: ${this.size.width}px; margin-left: ${this.size.width / -2}px; margin-top: ${this.size.height / -2}px; left: ${this.left}px; top: ${this.top}px` },

      /**
       * Sets the calibration mode (center, horiz, vert)
       * @return {[type]} [description]
       */
      mode () {
        if (!this.hasCalibrated.center) return 'center'
        if (!this.hasCalibrated.horiz) return 'horiz'
        if (!this.hasCalibrated.vert) return 'vert'
      }
    },

    watch: {
      isCalibrating (isCalibrating) {
        if (isCalibrating) {
          this.calibrate()
          this.$nextTick(this.repositionCalibrator)
        }
      }
    },

    mounted () {
      window.removeEventListener('resize', this.repositionCalibrator)
      window.addEventListener('resize', this.repositionCalibrator)
      this.repositionCalibrator()
    },

    methods: {
      /**
       * Reposition the calibrator
       */
      repositionCalibrator () {
        switch (this.mode) {
          case 'center':
            this.top = window.innerHeight / 2
            this.left = window.innerWidth / 2
            break
          case 'horiz':
            this.top = 0
            this.left = window.innerWidth - this.size.width
        }
      },

      /**
       * Starts calibrating the cursor, bringing it in closer to the calibrator
       */
      calibrate () {
        let isCalibrated
        let settings = Object.assign({}, this.settings)

        // Update calibration settings
        switch (this.mode) {
          case 'center':
            if (this.isCursorToTheLeft()) settings.offset.x = parseInt(settings.offset.x) + CALIBRATION.CENTER_STEP
            if (this.isCursorToTheRight()) settings.offset.x = parseInt(settings.offset.x) - CALIBRATION.CENTER_STEP
            if (this.isCursorAbove()) settings.offset.y = parseInt(settings.offset.y) + CALIBRATION.CENTER_STEP
            if (this.isCursorBelow()) settings.offset.y = parseInt(settings.offset.y) - CALIBRATION.CENTER_STEP
            break

          case 'horiz':
            if (this.isCursorToTheLeft()) settings.speed.x = settings.speed.x + CALIBRATION.HORIZ_STEP
            else if (this.isCursorToTheRight()) settings.speed.x = Math.max(0.05, parseInt(settings.speed.x) - CALIBRATION.HORIZ_STEP)
            break
        }
        this.$store.commit('set', ['settings', settings])

        // Maybe calibrate and repeat
        this.maybeShrinkCalibrator()
        isCalibrated = this.checkCalibration()
        this.updateCalibrationMode(isCalibrated)
        if (!isCalibrated) requestAnimationFrame(this.calibrate)
      },

      /**
       * Checks whether the calibration is complete calibration
       * @returns {BOL} whether we have finished calibration or not
       */
      checkCalibration () {
        switch (this.mode) {
          case 'center':
          case 'horiz':
            if (this.size.width > CALIBRATION.CENTER_STEP * 4) return false
            else return true
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
        const adjust = withBounds ? this.size / 2 : 0
        return this.cursor.position.top < this.top - adjust
      },
      isCursorBelow (withBounds) {
        const adjust = withBounds ? this.size / 2 : 0
        return this.cursor.position.top > this.top + adjust
      },
      isCursorCentered (withBounds) { return !this.isCursorToTheRight(withBounds) && !this.isCursorToTheLeft(withBounds) && !this.isCursorAbove(withBounds) && !this.isCursorBelow(withBounds) },

      /**
       * Updates the calibration mode (center, horiz, vert)
       * @param  {BOL} isCalibrated Whether we're calibrated or not
       */
      updateCalibrationMode (isCalibrated) {
        if (isCalibrated) {
          let hasCalibrated = this.hasCalibrated
          hasCalibrated[this.mode] = true
          this.$store.commit('set', ['hasCalibrated', hasCalibrated])
          this.$store.commit('set', ['isCalibrating', new Date()])
          this.repositionCalibrator()
        } else this.$store.commit('set', ['isCalibrating', true])
      },

      /**
       * Maybe shrinks the calibrator as it's being calibrated
       */
      maybeShrinkCalibrator () {
        // Shrink
        if (this.isCursorCentered(true)) {
          switch (this.mode) {
            case 'center':
              if (this.size.width > CALIBRATION.CENTER_STEP) {
                this.size.width -= CALIBRATION.SPEED
                this.size.height -= CALIBRATION.SPEED
              } else {
                this.size.width = CALIBRATION.START_SIZE
                this.size.height = CALIBRATION.START_SIZE
              }
              break

            case 'horiz':
              if (this.size.width > CALIBRATION.CENTER_STEP) {
                this.size.width -= CALIBRATION.SPEED
              } else {
                this.size.width = CALIBRATION.START_SIZE
                this.size.height = window.innerHeight
              }
              break
          }

        // Reset
        } else if (!this.isCursorCentered(true)) {
          switch (this.mode) {
            case 'center':
              if (this.size.width > CALIBRATION.CENTER_STEP) {
                this.size.width = CALIBRATION.START_SIZE
                this.size.height = CALIBRATION.START_SIZE
              }
              break
            case 'horiz':
              if (this.size.width > CALIBRATION.CENTER_STEP) {
                this.size.width = CALIBRATION.START_SIZE
                this.size.height = window.innerHeight
              }
              break
          }
        }
      }
    }
  }
</script>
