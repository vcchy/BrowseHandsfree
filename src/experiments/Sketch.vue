<template lang="pug">
  canvas#canvas-sketch.relative(ref='canvas')
</template>

<script>
  import paper from 'paper'
  import { distance } from 'mathjs'
  import { mapState } from 'vuex'
  import { debounce } from 'lodash'

  export default {
    computed: mapState([
      'lastFace',
      'cursor',
      'isWebcamOn',
      'settings'
    ]),

    watch: {
      lastFace (face) { this.draw() }
    },

    data () {
      return {
        path: null,
        offsets: null,
        tool: new paper.Tool(),
        lastPosition: {
          x: 0,
          y: 0
        }
      }
    },

    mounted () {
      // nextTick to allow for the canvas to reszie
      this.$nextTick(() => {
        const $canvas = this.$refs.canvas
        const bounds = $canvas.getBoundingClientRect()

        // Resize canvas
        paper.setup(this.$refs.canvas)
        window.addEventListener('resize', this.resizeCanvas)
        this.resizeCanvas()

        this.offsets = bounds
        this.$store.dispatch('maybeTogglePanel')
      })
    },

    destroyed () { window.removeEventListener('resize', this.resizeCanvas) },

    methods: {
      /**
       * Resizes the canvas
       */
      resizeCanvas: debounce(function () {
        const $canvas = this.$refs.canvas

        $canvas.width = $canvas.parentElement.clientWidth
        $canvas.height = $canvas.parentElement.clientHeight
        paper.view.viewSize = new paper.Size($canvas.width, $canvas.height)

        paper.view.draw()
        this.offsets = $canvas.getBoundingClientRect()
      }, 50, {leading: true, trailing: true}),

      /**
       * Handles drawing on the canvas
       */
      draw () {
        // Draw the line
        if (this.cursor.isDown && !this.cursor.clicked && this.path) {
          this.path.add(this.getPoint())
        }

        // Start a new line
        if (this.cursor.clicked) {
          this.path = new paper.Path()
          this.path.strokeWidth = 2
          this.path.strokeColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
          this.path.add(this.getPoint())
        }
      },

      /**
       * Gets the cursor position as a Paper point
       */
      getPoint () {
        let position = {
          x: this.cursor.position.left - this.offsets.left + this.settings.cursor.size / 2,
          y: this.cursor.position.top - this.offsets.top + window.scrollY + this.settings.cursor.size / 2
        }
        let dist = distance([this.lastPosition.x, this.lastPosition.y], [position.x, position.y])
        let newPosition = this.lastPosition

        if (dist > 10) this.lastPosition = newPosition = position

        return newPosition
      },

      clearSketch () {
        paper.project.activeLayer.removeChildren()
      }
    }
  }
</script>

<style scoped lang="stylus">
  #canvas-sketch
    top: 0
    left: 0
    width: 100% !important
    height: 100% !important
</style>
