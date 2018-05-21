<template lang="pug">
  div
    v-snackbar(v-model='snackbar.isVisible' top right :color='snackbar.color') {{snackbar.text}}
</template>

<script>
  import { mapState } from 'vuex'
  import jquery from 'jquery'

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

    data () {
      return {
        snackbar: {
          color: 'error',
          isVisible: false,
          text: ''
        }
      }
    },

    methods: {
      /**
       * Eval's all the userscripts
       * @param  {OBJ} face The BRFv4 face object
       */
      runScripts (face) {
        // eslint-disable-next-line
        let bhf = this
        // eslint-disable-next-line
        let $el = document.elementFromPoint(this.cursor.position.left, this.cursor.position.top)
        // eslint-disable-next-line
        let self = this
        // eslint-disable-next-line
        let $ = jquery

        if ($el) $el = $($el)

        try {
          this.userscripts.forEach((userscript) => {
            // eslint-disable-next-line
            eval(userscript.code)
          })
        } catch (e) {
          this.snackbar.text = e.toString()
          this.snackbar.isVisible = true
          this.snackbar.color = 'error'
        }
      }
    }
  }
</script>
