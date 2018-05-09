<template lang="pug">
  div(style='height: 100%; position: relative')
    .dasher-cursor-vert(:style='cursorVertStyles')
    .dasher-cursor-horiz(ref='dasherHoriz' :style='cursorHorizStyles')

    .dasher-symbol-wrapper(ref='dasherWrapper' :style='dasherWrapperStyles')
      div(v-for='symbol in symbols' :key='symbol')
    .dasher-symbol-overlay(:style='dasherWrapperStyles')
      div(v-for='symbol in symbols' :key='symbol' v-html='symbol')
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'cursor',
        'isTracking',
        'lastFrame'
      ]),

      cursorVertStyles () { return `top: ${this.position.top + 7}px; left: ${this.position.left + 7}px` },
      cursorHorizStyles () { return `left: ${this.position.left + 7}px` },
      dasherWrapperStyles () {
        if (this.$refs.dasherWrapper) this.height = this.$refs.dasherWrapper.parentElement.clientHeight
        return `width: ${this.width}px; height: ${this.height}px`
      }
    },

    watch: {
      lastFrame () { this.isTracking && this.onLastFrame() }
    },

    data () {
      return {
        // Position info for the crosshairs (same as the cursor position)
        position: {
          top: window.innerHeight / 2,
          left: window.innerWidth / 2
        },

        // The current dasher wrapper width/height
        width: 0,
        height: 0,

        // Dashers speed
        speed: 30,

        symbols: [
          '&middot;',
          '-'
        ]
      }
    },

    mounted () { this.$store.dispatch('maybeTogglePanel') },

    methods: {
      onLastFrame () {
        this.position = this.cursor.position
        this.width += this.speed

        if (window.innerWidth - this.position.left - 17 < this.width) this.width = 0
      }
    }
  }
</script>
