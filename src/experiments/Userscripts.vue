<template lang="pug">
  div
    ConfirmDialog(:isActive='isConfirmDialogActive' v-on:confirm:cancel='isConfirmDialogActive = false' v-on:confirm='deleteRecord' confirmLabel='Yes, Delete' cancelLabel='No, Cancel' title='Confirm Delete')
      p Are you sure you want to delete this userscript? <b>This action cannot be undone!</b>

    v-data-table(v-model='selected' select-all item-key='name' :headers='userscripts.headers' :items='userscripts.items' :rows-per-page-items='[25,50,100,{"text":"All","value":-1}]')
      //- Headers
      template(slot='headers' slot-scope='props')
        tr
          th
            | Active?
            v-checkbox(:input-value='props.all' :indeterminate='props.indeterminate' primary @click='toggleAll')
          th(v-for='header in props.headers' :key='header.text' :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click='changeSort(header.value)')
            | {{header.text}}

      //- Rows
      template(slot='items' slot-scope='props')
        tr(:active='props.selected')
          td(width='50px')
            v-checkbox(:input-value='props.selected' primary @click='props.selected = !props.selected')
          td {{props.item.name}}
          td {{props.item.description}}
          td {{props.item.domains}}
          td
            v-btn(icon color='primary')
              v-icon create
            v-btn(v-if='props.item.deletable' icon color='error' @click='showConfirmDeleteModal')
              v-icon delete
</template>

<script>
  import ConfirmDialog from '@/components/ConfirmDialog'

  export default {
    components: {
      ConfirmDialog
    },

    data () {
      return {
        isConfirmDialogActive: false,

        // The script potentially being deleted
        scriptBeingDeleted: null,

        // Helpers for the header template
        pagination: {sortBy: 'name'},
        selected: [],

        // "Built-in" userscripts
        userscripts: {
          headers: [
            {
              text: 'Name',
              value: 'name'
            },
            {
              text: 'Description',
              value: 'description',
              sortable: false
            },
            {
              text: 'Domains',
              value: 'domains'
            },
            {
              text: 'Actions',
              value: 'actions'
            }
          ],

          items: [
            {
              value: false,
              name: 'Hyperlinks & Buttons',
              selected: true,
              description: 'Handle hyperlink and button clicks',
              domains: '<All>',
              deletable: false
            },
            {
              value: false,
              name: 'Text Fields',
              selected: true,
              description: 'Handle interactions with text fields',
              domains: '<All>',
              deletable: false
            },
            {
              value: false,
              name: 'Toggles and Selects',
              selected: true,
              description: 'Handle interactions with checkboxes, radios, dropdowns, and select fields',
              domains: '<All>',
              deletable: false
            },
            {
              value: false,
              name: 'YouTube',
              selected: true,
              description: 'Handle interactions with YouTube videos, including 360 videos!',
              domains: 'https://youtube.com, https://m.youtube.com',
              deletable: true
            }
          ]
        }
      }
    },

    mounted () {
      this.$store.commit('set', ['isMainPanelVisible', false])
      this.toggleAll()
    },

    methods: {
      /**
       * Toggles all the userscripts
       */
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.userscripts.items.slice()
      },

      /**
       * Shows the confirm delete model
       *
       * @param The record being deleted
       */
      showConfirmDeleteModal (script) {
        this.scriptBeingDeleted = script
        this.isConfirmDialogActive = true
      },

      /**
       * Deletes a record
       */
      deleteRecord () {
        const index = this.userscripts.items.indexOf(this.scriptBeingDeleted)
        this.userscripts.items.splice(index, 1)
        this.isConfirmDialogActive = false
      }
    }
  }
</script>
