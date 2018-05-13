<template lang="pug">
  v-dialog(v-model='isActive' max-width='300' persistent)
    v-card
      v-card-title
        h1 {{theTitle}}
      v-card-text
        slot
      v-card-actions
        v-btn(color='primary' @click='confirm') {{labels.confirm}}
        v-btn(color='error' @click='cancel') {{labels.cancel}}
</template>

<script>
  export default {
    props: ['isActive', 'title', 'confirmLabel', 'cancelLabel'],

    data () {
      return {
        theTitle: this.title || 'Confirm',
        labels: {
          confirm: this.confirmLabel || 'Confirm',
          cancel: this.cancelLabel || 'Cancel'
        }
      }
    },

    methods: {
      /**
       * Triggers a cancel event
       */
      cancel () { this.$emit('confirm:cancel') },

      /**
       * Triggers a confirm event
       */
      confirm () { this.$emit('confirm') }
    }
  }
</script>
