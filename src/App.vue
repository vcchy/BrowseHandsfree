<template lang="pug">
  v-app
    v-toolbar(app dense color='yellow' flat extended style='position: relative')
      v-toolbar-title
        img.mr-2(src='@/assets/browsehandsfree-logo.png' height=30)
        span.mr-2 BrowseHandsfree
        small v{{$version}}
      v-spacer
    v-layout(row pb-2)
      v-flex.relative(xs8 offset-xs2 md6 offset-md3)
        v-card.card--flex-toolbar
          v-toolbar(card prominent dense dark color='purple lighten-2')
            v-toolbar-title Start Here
            v-spacer
            v-btn(icon @click.stop='isMainPanelVisible = !isMainPanelVisible')
              v-icon menu
          v-divider
          v-card-text(v-if='isMainPanelVisible').text-xs-center
            p
              img(src='@/assets/browsehandsfree-logo.png' alt='BrowseHandsfree' height=100)
            p.text-xs-left Welcome to <b>BrowseHandsfree</b>, a platform that lets you browse the web hands-free (via face tracking)! To get started, lets first turn on your webcam.
            p
              v-btn(@click.stop='startWebcam' color='primary')
                v-icon.mr-2 videocam
                | Start Webcam
            p
              small - or -
            p
              router-link(to='about') Learn more

    v-content
      router-view
    v-footer(app)
      span &copy; 2017
</template>

<script>
  export default {
    name: 'App',

    data () {
      return {
        isMainPanelVisible: true,
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
      startWebcam () {
        console.log('starting webcam')
      }
    }
  }
</script>
