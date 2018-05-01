<template lang="pug">
  #calibrator(ref='calibrator' :class='{hidden: !isCalibrating}' :style='style')
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        // The calibrators left position
        left: 0,

        // The calibrators top position
        top: 0,

        // The calibrators size. This starts at 100 and shrinks
        size: 100
      }
    },

    computed: {
      ...mapState([
        'cursor',
        'isCalibrating',
        'settings'
      ]),

      style () { return `left: ${this.left}px; top: ${this.top}px; height: ${this.size}px; width: ${this.size}px;` }
    },

    watch: {
      isCalibrating (isCalibrating) {
        if (isCalibrating) {
          this.repositionCalibrator()
          this.calibrate()
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
        this.left = window.innerWidth / 2 - this.size / 2
        this.top = window.innerHeight / 2 - this.size / 2
      },

      /**
       * Starts calibrating the cursor, bringing it in closer to the calibrator
       */
      calibrate () {
        let isCalibrated = true
        let settings = Object.assign({}, this.settings)

        // Set positions
        if (this.isCursorToTheLeft()) {
          settings.offset.x = parseInt(settings.offset.x) + 10
          isCalibrated = false
        }
        if (this.isCursorToTheRight()) {
          settings.offset.x = parseInt(settings.offset.x) - 10
          isCalibrated = false
        }
        if (this.isCursorAbove()) {
          settings.offset.y = parseInt(settings.offset.y) + 10
          isCalibrated = false
        }
        if (this.isCursorBelow()) {
          settings.offset.y = parseInt(settings.offset.y) - 10
          isCalibrated = false
        }

        // Shrink calibrator
        if (this.isCursorCentered() && this.size > 10) this.size -= 5
        else if (!this.isCursorCentered() && this.size > 10) this.size = 100
        this.repositionCalibrator()

        if (this.size > 40) isCalibrated = false
        this.$store.commit('merge', ['settings', settings])
        this.$store.commit('set', ['isCalibrating', !isCalibrated])

        if (!isCalibrated) requestAnimationFrame(this.calibrate)
      },

      /**
       * Cursor position helpers
       */
      isCursorToTheLeft () { return this.cursor.position.left < this.left },
      isCursorToTheRight () { return this.cursor.position.left > this.left + this.size },
      isCursorAbove () { return this.cursor.position.top < this.top },
      isCursorBelow () { return this.cursor.position.top > this.top + this.size },
      isCursorCentered () { return !this.isCursorToTheRight() && !this.isCursorToTheLeft() && !this.isCursorAbove() && !this.isCursorBelow() }
    }
  }
</script>
