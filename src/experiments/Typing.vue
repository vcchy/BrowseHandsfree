<template lang="pug">
  div(style='height: 100%; position: relative')
    PanelWrap
      v-card
        v-card-title
          h3(v-html='parsedText' style='word-wrap: break-word')

    .dasher-cursor-vert(:style='cursorVertStyles')
    .dasher-cursor-horiz(ref='dasherHoriz' :style='cursorHorizStyles')
    .dasher-safe-zone

    .dasher-red-zone(:style='redZoneStyles')
    .dasher-green-zone(ref='greenZone' :style='greenZoneStyles')
      div(v-for='symbol in symbols' :key='symbol')
    .dasher-green-zone-overlay(:style='greenZoneStyles')
      div(v-for='symbol in symbols' :key='symbol' v-html='symbol')
</template>

<script>
  import { mapState } from 'vuex'
  import PanelWrap from '@/components/PanelWrap'

  export default {
    components: {
      PanelWrap
    },

    computed: {
      ...mapState([
        'cursor',
        'isTracking',
        'lastFrame',
        'settings'
      ]),

      /**
       * Calculate the different zone styles
       */
      cursorVertStyles () { return `top: ${this.position.top + 7}px; left: ${this.position.left + 7}px` },
      cursorHorizStyles () { return `left: ${this.position.left + 7}px` },

      greenZoneStyles () {
        if (this.$refs.greenZone) this.height = this.$refs.greenZone.parentElement.clientHeight
        return `width: ${this.zone.green.width}px; height: ${this.height}px`
      },
      redZoneStyles () {
        if (this.$refs.redZone) this.height = this.$refs.redZone.parentElement.clientHeight
        return `width: ${this.zone.red.width}px; height: ${this.height}px`
      },

      /**
       * Parses in HTML Entities
       */
      parsedText () {
        let text = this.text
        text = text.replace(/\*/g, '&middot;')
        text = text.replace(/-/g, '&mdash;')

        return text
      }
    },

    watch: {
      lastFrame () { this.isTracking && this.onLastFrame() }
    },

    data () {
      return {
        // Position info for the crosshairs (same as the cursor position)
        position: {
          top: window.innerHeight / 2 + 24,
          left: window.innerWidth / 2
        },

        // The current dasher wrapper width/height
        height: 0,

        symbols: [
          '&middot;',
          '&mdash;'
        ],

        // The current textual content
        text: '',

        zone: {
          green: {
            width: 0
          },
          red: {
            width: 0
          }
        }
      }
    },

    mounted () {
      this.$store.dispatch('maybeTogglePanel')
      this.height = this.$refs.greenZone.parentElement.clientHeight
    },

    methods: {
      /**
       * Grows one of the zones
       */
      onLastFrame () {
        this.position = this.cursor.position

        if (this.inGreenZone()) {
          this.zone.green.width += this.settings.typing.speed
          this.zone.red.width = 0
        } else if (this.inRedZone()) {
          this.zone.red.width += this.settings.typing.speed
          this.zone.green.width = 0
        } else if (this.inSafeZone()) {
          this.resetZones()
        }

        if (this.zone.green.width > window.innerWidth - this.position.left - 17) this.typeSymbol()
        else if (this.zone.red.width > this.position.left + 7) this.removeSymbol()
      },

      /**
       * Determines if we are within the safezone
       */
      inSafeZone () { return !this.inGreenZone() && !this.inRedZone() },
      inRedZone () { return this.cursor.position.left < window.innerWidth / 2 - 65 },
      inGreenZone () { return this.cursor.position.left > window.innerWidth / 2 + 44 },

      /**
       * Resets the zones
       */
      resetZones () {
        this.zone.green.width = 0
        this.zone.red.width = 0
      },

      /**
       * Inputs a symbol (back/spaces are symbols)
       */
      typeSymbol () {
        const $greenZone = this.$refs.greenZone
        this.text += this.position.top < $greenZone.offsetTop + 93 + $greenZone.clientHeight / 2 ? '*' : '-'
        this.resetZones()
      },

      /**
       * Removes a symbol
       */
      removeSymbol () {
        this.text = this.text.slice(0, -1)
        this.resetZones()
      }
    }
  }
</script>
