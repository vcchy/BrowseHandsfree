<template lang="pug">
  div(style='height: 100%; position: relative')
    PanelWrap
      v-card
        v-card-text
          p <b>Letter:</b> <span v-html='curSymbol' style='font-size: 18px; font-weight: 900'></span> <span v-html='predictedLetter' style='font-weight: 900; font-size: 18px; color: red'></span>
          p <b>Message:</b> {{message}}

    .dasher-cursor-vert(:style='cursorVertStyles')
    .dasher-cursor-horiz(ref='dasherHoriz' :style='cursorHorizStyles')
    .dasher-safe-zone

    .dasher-red-zone(:style='redZoneStyles')
    .dasher-green-zone(ref='greenZone' :style='greenZoneStyles')
      div(v-for='symbol in symbols' :key='symbol')
    .dasher-green-zone-overlay(:style='greenZoneStyles')
      div.dasher-symbol(v-for='symbol in symbols' :key='symbol' v-html='symbol')
</template>

<script>
  import { mapState } from 'vuex'
  import PanelWrap from '@/components/PanelWrap'
  import morseCodes from '@/json/morseCodes.json'

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
       * Shows a predicted letter, based on the current symbols
       */
      predictedLetter () { return morseCodes[this.curSymbol] || '' }
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
          '·',
          '—',
          '&nbsp;'
        ],

        // The current symbol string
        curSymbol: '',

        // Once the symbol is finished with a space, it gets added to this as an ascii character
        message: '',

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

        this.maybeAddSymbol()
        this.maybeRemoveSymbol()
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
       * Adds a symbol to the current letter
       */
      maybeAddSymbol () {
        if (this.zone.green.width > window.innerWidth - this.position.left - 17) {
          let $el = document.elementFromPoint(this.position.left, this.position.top)

          if ($el && $el.classList.contains('dasher-symbol')) {
            if ($el.innerHTML === '&nbsp;') this.addSymbolToMessage()
            else this.curSymbol += $el.innerHTML
          }

          this.resetZones()
        }
      },

      /**
       * Parses the current symbol and adds it to the message
       */
      addSymbolToMessage () {
        let letter = morseCodes[this.curSymbol]
        if (letter) this.message += letter
        else if (!letter && !this.curSymbol) this.message += ' '
        this.curSymbol = ''
      },

      /**
       * Removes a symbol from the current letter
       */
      maybeRemoveSymbol () {
        if (this.zone.red.width > this.position.left + 7) {
          if (this.curSymbol.length) this.curSymbol = this.curSymbol.slice(0, -1)
          else this.message = this.message.slice(0, -1)

          this.resetZones()
        }
      }
    }
  }
</script>
