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

    methods: {
      startWebcam () {
        console.log('starting webcam')
      }
    }
  }
</script>

<style lang="stylus">
  img
    max-width: 100%

  .toolbar__title
    img
      vertical-align: middle
    small
      font-size: 0.5em

  .card--flex-toolbar
    position: absolute
    top: -48px
    width: 100%

  .toolbar--fixed.toolbar--extended
    z-index: 0

  .relative
    position: relative
</style>
