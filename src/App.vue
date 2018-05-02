<template lang="pug">
  v-app
    Pointer
    Calibrator
    v-toolbar(app dense color='yellow' flat extended style='position: relative')
      v-toolbar-title
        img.mr-2(src='static/img/browsehandsfree-logo.png' height=30)
        span.mr-2 BrowseHandsfree
        small v{{$version}}
      v-spacer
    v-layout(row pb-2)
      v-flex.relative(xs8 offset-xs2 md6 offset-md3)
        v-card.card--flex-toolbar.mb-5
          v-toolbar(card prominent dense dark color='purple lighten-2')
            v-toolbar-title Start Here
            v-spacer
            v-tooltip(v-if='isWebcamOn && isTracking && !isCalibrating')
              v-btn(icon @click='calibrate' slot='activator')
                v-icon gps_fixed
              span Calibrate
            v-tooltip
              v-btn(icon @click='toggleWebcam' :color='isWebcamOn ? "error" : "primary"' slot='activator')
                v-icon(v-if='isWebcamOn') videocam_off
                v-icon(v-else) videocam
              span(v-text='isWebcamOn ? "Turn Webcam Off" : "Turn Webcam On"')
            v-btn(icon @click='toggleMainPanelVisibility')
              v-icon menu
          v-divider

          Webcam
            div(v-if='isWebcamOn && isTracking && !hasCalibrated')
              h1 Let's Calibrate!
              p Imagine a line extending straight out from between your eyes and onto the screen. The dot is placed where this imaginary line meets your screen. To move the dot simply turn, tilt, and move your head around. Give it a try!
              p Once you're comfortable with how it works, point your head towards the center of your screen and click the calibrate button below. Don't move your head while the cursor calibrates - the goal is to have the cursor reach the center of your screen on it's own.
              v-alert(type="info" :value='true')
                |<b>Hint:</b> To scroll the page, move the cursor below or above your screen!
    v-content
      router-view
    v-footer(app)
      span &copy; 2017
</template>

<script>
  import Webcam from '@/components/Webcam'
  import Pointer from '@/components/Pointer'
  import Calibrator from '@/components/Calibrator'
  import { mapState } from 'vuex'

  export default {
    name: 'App',

    computed: mapState([
      'hasCalibrated',
      'isCalibrating',
      'isWebcamOn',
      'isTracking'
    ]),

    components: {
      Calibrator,
      Pointer,
      Webcam
    },

    data () {
      return {
        menuItems: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }]
      }
    },

    mounted () {
      console.log(`                _.-'-'--.
               ,', ~'\` ( .'\`.
              ( ~'_ , .'(  >-)
             ( .-' (  \`__.-<  )
              ( \`-..--'_   .-')
               \`(_( (-' \`-'.-)
                   \`-.__.-'=/
                      \`._\`='
                         \\\\
                          \\\\
  __________
  \\______   \\_______  ______  _  ________ ____
   |    |  _/\\_  __ \\/  _ \\ \\/ \\/ /  ___// __ \\
   |    |   \\ |  | \\(  <_> )     /\\___ \\\\  ___/
   |______  / |__|   \\____/ \\/\\_//____  >\\___  >
          \\/                          \\/     \\/
    ___ ___                    .___        _____
   /   |   \\_____    ____    __| _/_______/ ____\\______   ____   ____
  /    ~    \\__  \\  /    \\  / __ |/  ___/\\   __\\\\_  __ \\_/ __ \\_/ __ \\
  \\    Y    // __ \\|   |  \\/ /_/ |\\___ \\  |  |   |  | \\/\\  ___/\\  ___/
   \\___|_  /(____  /___|  /\\____ /____  > |__|   |__|    \\___  >\\___  >
         \\/      \\/     \\/      \\/    \\/                     \\/     \\/

    Our vision is a world where anyone can do anything.
    Started by Oz Ramos; supported by friends ♥`)
    },

    methods: {
      toggleMainPanelVisibility () { this.$store.commit('flip', 'isMainPanelVisible') },

      toggleWebcam () { this.$store.commit('flip', 'isWebcamOn') },

      /**
       * Starts the recalibration process
       */
      calibrate () { this.$store.commit('set', ['isCalibrating', true]) }
    }
  }
</script>
