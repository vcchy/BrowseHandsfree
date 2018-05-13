<template lang="pug">
  div
    ConfirmDialog(:isActive='isConfirmDialogActive' v-on:confirm:cancel='isConfirmDialogActive = false' v-on:confirm='deleteRecord' confirmLabel='Yes, Delete' cancelLabel='No, Cancel' title='Confirm Delete')
      p Are you sure you want to delete this userscript? <b>This action cannot be undone!</b>

    v-data-table(v-model='selected' select-all item-key='id' :headers='userscripts.headers' :items='userscripts.items' :rows-per-page-items='[25,50,100,{"text":"All","value":-1}]')
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

          //- Read Mode
          template(v-if='curUserscriptIndex !== props.index')
            td {{props.item.name}}
            td {{props.item.description}}
            td {{props.item.domains}}

          //- Edit Mode
          template(v-else)
            td
              v-text-field(v-model='props.item.name')
            td
              v-text-field(v-model='props.item.description')
            td
              v-text-field(v-model='props.item.domains')

          td
            v-btn(icon color='primary' @click='toggleEditor(props)')
              v-icon create
            v-btn(v-if='props.item.deletable' icon color='error' @click='showConfirmDeleteModal')
              v-icon delete

      //- Editor
      template(slot='expand' slot-scope='props')
        v-card(flat)
          v-card-text(style='padding: 0')
            Codemirror(ref='editor' v-model='userscript.code' :options='codemirrorOpts')
</template>

<script>
  import ConfirmDialog from '@/components/ConfirmDialog'
  import Codemirror from '@/setup/Codemirror'

  export default {
    components: {
      ConfirmDialog,
      Codemirror
    },

    data () {
      return {
        isConfirmDialogActive: false,

        // The script potentially being deleted
        scriptBeingDeleted: null,

        // Helpers for the header template
        pagination: {sortBy: 'name'},
        selected: [],

        // Codemirror Options
        codemirrorOpts: {
          mode: 'javascript',
          lineWrapping: true,
          lineNumbers: true,
          tabSize: 2,
          keyMap: 'sublime'
        },

        // The current userscript being edited
        userscript: {
          id: '',
          name: '',
          selected: null,
          description: '',
          domains: '',
          deletable: null,
          code: ''
        },
        // The currently selected userscript index
        curUserscriptIndex: -1,

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
              value: 'domains',
              sortable: false
            },
            {
              text: 'Actions',
              value: 'actions',
              sortable: false
            }
          ],

          items: [
            {
              id: 'com.browsehandsfree.hyperlinks',
              value: false,
              name: 'Hyperlinks & Buttons',
              selected: true,
              description: 'Handle hyperlink and button clicks',
              domains: '<All>',
              deletable: false,
              code: ''
            },
            {
              id: 'com.browsehandsfree.textfields',
              value: false,
              name: 'Text Fields',
              selected: true,
              description: 'Handle interactions with text fields',
              domains: '<All>',
              deletable: false,
              code: ''
            },
            {
              id: 'com.browsehandsfree.toggles',
              value: false,
              name: 'Toggles and Selects',
              selected: true,
              description: 'Handle interactions with checkboxes, radios, dropdowns, and select fields',
              domains: '<All>',
              deletable: false,
              code: ''
            },
            {
              id: 'com.browsehandsfree.youtube',
              value: false,
              name: 'YouTube',
              selected: true,
              description: 'Handle interactions with YouTube videos, including 360 videos!',
              domains: 'https://youtube.com, https://m.youtube.com',
              deletable: true,
              code: ''
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
       * Toggles the editor and sets its focus
       *
       * @param {OBJ} props The scope passed into the editor template from the v-data-table
       */
      toggleEditor (props) {
        props.expanded = !props.expanded

        if (props.expanded) {
          this.curUserscriptIndex = props.index
          this.$nextTick(() => {
            this.$refs.editor.codemirror.focus()
          })
        } else {
          this.curUserscriptIndex = -1
        }
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
