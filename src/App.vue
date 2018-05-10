<template lang="pug">
  v-app
    Pointer
    Calibrator
    v-toolbar(app dense :color='headerColor' flat extended style='position: relative')
      v-toolbar-title
        img.mr-2(src='static/img/browsehandsfree-logo.png' height=30)
        span.mr-2 BrowseHandsfree
        small v{{$version}}
      v-spacer
      v-tooltip.mr-3(bottom nudge-left)
        a(href='https://browsehandsfree.atlassian.net/wiki/spaces/HOWTO/overview' slot='activator')
          v-icon help
        span View Our Flight Manual
      v-btn.mr-4(icon @click='isSidebarOpen = !isSidebarOpen')
        v-icon menu
    v-layout(row pb-2)
      PanelWrap
        v-card.card--flex-toolbar.mb-5
          v-toolbar(card prominent dense dark color='purple lighten-2')
            v-toolbar-title {{mainPanelTitle}}
            v-spacer
            v-tooltip(v-if='isWebcamOn && isTracking && isFeedVisible')
              v-btn(icon @click='toggleFeed' slot='activator')
                v-icon visibility_off
              span Hide Feed
            v-tooltip(v-if='isWebcamOn && isTracking && !isFeedVisible')
              v-btn(icon @click='toggleFeed' slot='activator')
                v-icon visibility
              span Show Feed
            v-tooltip(v-if='isWebcamOn && isTracking')
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
            CalibrationInstructions(v-if='isWebcamOn && isTracking && !hasCalibrated')
            Settings(v-if='isWebcamOn && isTracking && hasCalibrated')

    v-content
      router-view

    v-navigation-drawer(v-model='isSidebarOpen' right fixed app)
      v-list
        v-list-tile(to='/' @click='isSidebarOpen = false')
          v-list-tile-action
            v-icon palette
          v-list-tile-content Sketch Demo
        v-list-tile(to='typing' @click='isSidebarOpen = false')
          v-list-tile-action
            v-icon games
          v-list-tile-content Typing Demo

    v-footer.text-xs-center(app)
      span &copy; 2018. Started by <a href="https://twitter.com/labofoz">Oz Ramos</a>, supported by friends &hearts;
</template>

<script>
  import Webcam from '@/components/Webcam'
  import Pointer from '@/components/Pointer'
  import PanelWrap from '@/components/PanelWrap'
  import Calibrator from '@/components/Calibrator'
  import CalibrationInstructions from '@/components/CalibrationInstructions'
  import Settings from '@/components/Settings'
  import { mapState } from 'vuex'

  export default {
    name: 'App',

    computed: {
      ...mapState([
        'hasCalibrated',
        'isCalibrating',
        'isFeedVisible',
        'isWebcamOn',
        'isTracking',
        'mainPanelTitle'
      ]),
      headerColor () {
        switch (this.$route.name) {
          case 'Sketch': return 'yellow'
          case 'Typing': return 'light-green'
        }
      }
    },

    components: {
      Calibrator,
      CalibrationInstructions,
      PanelWrap,
      Pointer,
      Settings,
      Webcam
    },

    data () {
      return {
        isSidebarOpen: false
      }
    },

    mounted () {
      // Set the chrome background page
      if (window.chrome && window.chrome.extension) this.$store.commit('set', ['chromeBgPage', window.chrome.extension.getBackgroundPage()])

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
      toggleFeed () { this.$store.commit('flip', 'isFeedVisible') },

      /**
       * Starts the recalibration process
       */
      calibrate () { this.$store.commit('set', ['isCalibrating', true]) }
    }
  }
</script>
