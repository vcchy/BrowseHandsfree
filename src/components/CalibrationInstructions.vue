<template lang="pug">
  div
    h1 Let's Calibrate Your Center!
    p Imagine a line extending straight out from between your eyes and onto the screen. The dot is placed where this imaginary line meets your screen. To move the dot simply turn, tilt, and move your head around. Give it a try!
    p
      video(src='static/vid/calibration-demo-18-5-2.mp4' autoplay controls loop)
    p Once you're comfortable with how it works, point your head towards the center of your screen and click the <v-icon>gps_fixed</v-icon> calibrate button below or above. Don't move your head while the cursor calibrates - the goal is to have the cursor reach the center of your screen on it's own.
    v-alert(type="info" :value='true')
      |<b>Hint:</b> To scroll the page, move the cursor below or above your screen!
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState([
      'hasCalibrated',
      'isTracking',
      'isWebcamOn'
    ]),

    mounted () { this.$store.commit('set', ['mainPanelTitle', 'Calibrate']) }
  }
</script>
