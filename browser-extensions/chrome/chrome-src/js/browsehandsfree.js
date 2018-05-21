let BrowseHandsfree = {
  $store: {
    cursor: {}
  },

  $refs: {
    // The cursor element
    cursor: document.createElement('div')
  },

  // Collection of all userscripts
  userscripts: [],

  methods: {
    /**
     * Updates the cursor and fires off all events
     * @param {OBJ} data The cursor and associated data {cursor, face, gesture, settings}
     */
    updateCursor (data) {
      let cursor = this.$store.cursor = data.cursor

      this.$refs.cursor.style.display = 'block'
      this.$refs.cursor.style.left = `${cursor.position.left}px`
      this.$refs.cursor.style.top = `${cursor.position.top}px`
    },

    /**
     * Updates the set of userscripts
     * @param {ARR} userscripts The collection of userscripts
     */
    updateUserscripts (userscripts) {
      this.$store.userscripts = userscripts
    }
  }
}

BrowseHandsfree.$refs.cursor.id = 'browsehandsfree-cursor'
BrowseHandsfree.$refs.cursor.style.background = 'rgba(255, 0, 0, 0.85)'
BrowseHandsfree.$refs.cursor.style.border = '2px solid rgba(255, 0, 0, 0.85)'
BrowseHandsfree.$refs.cursor.style.transformOrigin = 'center'
BrowseHandsfree.$refs.cursor.style.width = '15px'
BrowseHandsfree.$refs.cursor.style.height = '15px'
BrowseHandsfree.$refs.cursor.style.borderRadius = '15px'
BrowseHandsfree.$refs.cursor.style.opacity = 0.8
BrowseHandsfree.$refs.cursor.style.position = 'fixed'
BrowseHandsfree.$refs.cursor.style.display = 'none'
BrowseHandsfree.$refs.cursor.style.zIndex = 9999999
document.body.appendChild(BrowseHandsfree.$refs.cursor)

/**
 * Listen for cursor updates
 */
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (!msg.browsehandsfree) return
  BrowseHandsfree.methods[msg.method].call(BrowseHandsfree, msg.data)
})
