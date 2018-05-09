<template lang="pug">
  div
    .dasher-cursor-vert(:style='cursorVertStyles')
    .dasher-cursor-horiz(ref='dasherHoriz' :style='cursorHorizStyles')
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
      cursorHorizStyles () { return `left: ${this.position.left + 7}px` }
    },

    watch: {
      lastFrame () { this.isTracking && this.onLastFrame() }
    },

    data () {
      return {
        input: 'test',
        position: {
          top: window.innerHeight / 2,
          left: window.innerWidth / 2
        }
      }
    },

    mounted () { this.$store.dispatch('maybeTogglePanel') },

    methods: {
      onLastFrame () {
        this.position = this.cursor.position
      }
    }
  }
</script>
