<template lang="pug">
  div
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    computed: mapState([
      'hasCalibrated',
      'isTracking',
      'isWebcamOn'
    ]),
    mounted () {
      this.isWebcamOn && this.isTracking && this.hasCalibrated && this.$store.commit('set', ['mainPanelTitle', 'Settings'])
    }
  }
</script>
