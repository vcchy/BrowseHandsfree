<template lang="pug">
  div
    ConfirmDialog(:isActive='isConfirmDialogActive' v-on:confirm:cancel='isConfirmDialogActive = false' v-on:confirm='deleteRecord' confirmLabel='Yes, Delete' cancelLabel='No, Cancel' title='Confirm Delete')
      p Are you sure you want to delete this userscript? <b>This action cannot be undone!</b>

    v-data-table(ref='table' v-model='selected' select-all item-key='id' :headers='userscripts.headers' :items='userscripts.items' :rows-per-page-items='[25,50,100,{"text":"All","value":-1}]')
      //- Headers
      template(slot='headers' slot-scope='props')
        tr
          th
            | Active?
            v-checkbox(:input-value='props.all' :indeterminate='props.indeterminate' primary @click='toggleAll')
          th(v-for='header in props.headers' :key='header.text' :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click='changeSort(header.value)')
            | {{header.text}}
          th
            | Actions
            v-tooltip(top)
              v-btn(icon color='success' slot='activator' @click='addNewScript')
                v-icon add_circle
              span New Userscript

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
            v-btn(icon color='primary' @click='toggleEditor(props)' :ref='props.item.id')
              v-icon create
            v-btn(v-if='props.item.deletable' icon color='error' @click='showConfirmDeleteModal')
              v-icon delete

      //- Editor
      template(slot='expand' slot-scope='props')
        v-card(flat)
          v-card-text(style='padding: 0')
            Codemirror(ref='editor' v-model='userscript.code' :options='codemirrorOpts' @input='onCodemirrorChange')
</template>

<script>
  import ConfirmDialog from '@/components/ConfirmDialog'
  import Codemirror from '@/setup/Codemirror'
  import {debounce} from 'lodash'
  import lockr from 'lockr'
  const UUID = require('uuid/v4')

  const newItemClone = {
    id: '',
    value: false,
    name: '',
    selected: true,
    description: '',
    domains: '',
    deletable: true,
    code: ''
  }

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
            }
          ],

          items: lockr.get('userscripts') || []
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
          this.userscript = this.userscripts.items[this.curUserscriptIndex]
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
      },

      /**
       * Adds a new userscript
       */
      addNewScript () {
        let script = Object.assign({}, newItemClone)
        script.id = UUID()
        script.name = 'Untitled'
        script.description = 'New userscript'
        script.domains = '<All>'
        this.userscripts.items.push(script)

        this.$nextTick(() => {
          this.selected.push(script)
          this.curUserscriptIndex = this.userscripts.length - 1
          this.$refs[script.id].$emit('click')
        })
      },

      /**
       * Called whenever a change is made to autosave it
       * @param {STR} code The codemirror code
       */
      onCodemirrorChange: debounce(function () {
        lockr.set('userscripts', this.userscripts.items)
      }, 500, {leading: true, trailing: true})
    }
  }
</script>
