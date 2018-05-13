<template lang="pug">
  v-dialog(v-model='isActive' max-width='300' persistent)
    v-card
      v-card-title
        h1 Confirm
      v-card-text
      v-card-actions
        v-btn(color='primary') Confirm
        v-btn(color='error' @click='cancel') Cancel
</template>

<script>
  export default {
    props: ['isActive'],

    methods: {
      /**
       * Closes the modal
       */
      cancel () {
        console.log('cancel')
        this.$emit('confirm:cancel')
      }
    }
  }
</script>
