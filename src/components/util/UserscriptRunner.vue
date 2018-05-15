<template lang="pug">
  div
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'cursor',
        'lastFace',
        'userscripts'
      ])
    },

    watch: {
      lastFace (face) { this.runScripts(face) }
    },

    methods: {
      /**
       * Eval's all the userscripts
       * @param  {OBJ} face The BRFv4 face object
       */
      runScripts (face) {
        // eslint-disable-next-line
        let bhf = this
        try {
          this.userscripts.forEach((userscript) => {
            // eslint-disable-next-line
            eval(userscript.code)
          })
        } catch (e) {
          console.log('ERROR', e)
        }
      }
    }
  }
</script>
