<template lang="pug">
  v-app
    Pointer
    Calibrator
    v-toolbar(app dense color='yellow' flat extended style='position: relative')
      v-toolbar-title
        img.mr-2(src='@/assets/browsehandsfree-logo.png' height=30)
        span.mr-2 BrowseHandsfree
        small v{{$version}}
      v-spacer
    v-layout(row pb-2)
      v-flex.relative(xs8 offset-xs2 md6 offset-md3)
        v-card.card--flex-toolbar.mb-5
          v-toolbar(card prominent dense dark color='purple lighten-2')
            v-toolbar-title Start Here
            v-spacer
            v-btn(icon @click='toggleWebcam' :color='isWebcamOn ? "error" : "primary"')
              v-icon(v-if='isWebcamOn') videocam_off
              v-icon(v-else) videocam
            v-btn(icon @click='toggleMainPanelVisibility')
              v-icon menu
          v-divider
          Webcam

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
      'isWebcamOn'
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

      toggleWebcam () { this.$store.commit('flip', 'isWebcamOn') }
    }
  }
</script>
