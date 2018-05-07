<template lang="pug">
  v-container(fluid)
    v-layout
      p The <v-icon>gps_fixed</v-icon> Calibrator will adjust the offsets for you, but you can adjust any other variable below! You can close this menu with the <v-icon>menu</v-icon> menu icon above and draw anywhere on the page to test your settings!

    v-layout(row wrap)
      v-flex(xs2 sm1)
        v-tooltip.offset(absolute=true attach='#infotip-offset-x')
          v-icon#infotip-offset-x(color='info' slot='activator') info
          span Number of pixels to shift the cursor horizontally by. <b>Left &lt;---&gt; Right</b>
      v-flex(xs10 sm8)
        v-slider(label='x-Offset' v-model='settings.offset.x' :max='offset.x.max' :min='offset.x.min')
      v-flex(xs12 sm3)
        v-text-field(v-model='settings.offset.x')

      v-flex(xs2 sm1)
        v-tooltip.offset(absolute=true attach='#infotip-offset-y')
          v-icon#infotip-offset-y(color='info' slot='activator') info
          span Number of pixels to shift the cursor vertically by. <b>Up &lt;---&gt; Down</b>
      v-flex(xs10 sm8)
        v-slider(label='y-Offset' v-model='settings.offset.y' :max='offset.y.max' :min='offset.y.min')
      v-flex(xs12 sm3)
        v-text-field(v-model='settings.offset.y')

      v-flex(xs2 sm1)
        v-tooltip.offset(absolute=true attach='#infotip-x-speed')
          v-icon#infotip-x-speed(color='info' slot='activator') info
          span Horizontal cursor speed. <b>Slower &lt;---&gt; Faster</b>
      v-flex(xs10 sm8)
        v-slider(label='x-Speed' v-model='settings.speed.x' step='0' :max='speed.x.max' :min='speed.x.min')
      v-flex(xs12 sm3)
        v-text-field(v-model='settings.speed.x')

      v-flex(xs2 sm1)
        v-tooltip.offset(absolute=true attach='#infotip-y-speed')
          v-icon#infotip-y-speed(color='info' slot='activator') info
          span Vertical cursor speed. <b>Slower &lt;---&gt; Faster</b>
      v-flex(xs10 sm8)
        v-slider(label='y-Speed' v-model='settings.speed.y' step='0' :max='speed.y.max' :min='speed.y.min')
      v-flex(xs12 sm3)
        v-text-field(v-model='settings.speed.y')

      v-flex(xs2 sm1)
        v-tooltip.offset(absolute=true attach='#infotip-scroll-speed')
          v-icon#infotip-scroll-speed(color='info' slot='activator') info
          span Page scroll speed. <b>Slower &lt;---&gt; Faster</b>
      v-flex(xs10 sm8)
        v-slider(label='Scroll Speed' v-model='settings.scroll.sensitivity' step='0' :max='scroll.sensitivity.max' :min='scroll.sensitivity.min')
      v-flex(xs12 sm3)
        v-text-field(v-model='settings.scroll.sensitivity')

      v-flex(xs2 sm1)
        v-tooltip.offset(absolute=true attach='#infotip-click-sensitivity')
          v-icon#infotip-click-sensitivity(color='info' slot='activator') info
          span Smile-to-click threshold. <b>Small Smile &lt;---&gt; Big Smile</b>
      v-flex(xs10 sm8)
        v-slider(label='Click Sensitivity' v-model='settings.click.sensitivity' step='0' :max='click.sensitivity.max' :min='click.sensitivity.min')
      v-flex(xs12 sm3)
        v-text-field(v-model='settings.click.sensitivity')
</template>

<script>
  import { mapState } from 'vuex'
  import lockr from 'lockr'

  export default {
    computed: mapState([
      'hasCalibrated',
      'isTracking',
      'isWebcamOn',
      'settings'
    ]),

    watch: {
      settings: {
        deep: true,
        handler () { lockr.set('settings', this.settings) }
      }
    },

    mounted () {
      this.isWebcamOn && this.isTracking && this.hasCalibrated && this.$store.commit('set', ['mainPanelTitle', 'Settings'])

      window.addEventListener('resize', this.updateSettingBounds)
      this.updateSettingBounds()
    },

    destroyed () { window.removeEventListener('resize', this.updateSettingBounds) },

    data () {
      return {
        offset: {
          x: {
            min: -999999,
            max: 999999
          },
          y: {
            min: -999999,
            max: 999999
          }
        },

        speed: {
          x: {
            min: 0.01,
            max: 10
          },
          y: {
            min: 0.01,
            max: 10
          }
        },

        scroll: {
          sensitivity: {
            min: 0.01,
            max: 4
          }
        },

        click: {
          sensitivity: {
            min: 1,
            max: 2
          }
        }
      }
    },

    methods: {
      /**
       * Update min's and max's based on window size
       */
      updateSettingBounds () {
        this.offset.x.min = window.innerWidth * -2
        this.offset.x.max = window.innerWidth * 2

        this.offset.y.min = window.innerHeight * -2
        this.offset.y.max = window.innerHeight * 2
      }
    }
  }
</script>

<style scoped lang="stylus">
  .tooltip
    display: block
    text-align: center
    line-height: 62px
</style>
