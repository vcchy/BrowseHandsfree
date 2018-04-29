<template lang="pug">
  v-app
    v-navigation-drawer(persistent v-model='drawer' enable-resize-watcher fixed app)
      v-list
        v-list-tile(value='true' v-for='(menuItem, i) in menuItems' :key='i')
          v-list-tile-action
            v-icon(v-html='menuItem.icon')
          v-list-tile-content
            v-list-tile-title(v-text='item.title')
    v-toolbar(app)
      v-toolbar-side-icon(@click.stop='drawer = !drawer')
      v-toolbar-title(v-text='title')
      v-spacer
    v-content
      router-view
    v-footer(app)
      span &copy; 2017
</template>

<script>
  export default {
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'BrowseHandsfree'
      }
    },
    name: 'App'
  }
</script>
