let BrowseHandsfree = {
  // The cursor values, see @/store/index.js
  cursor: {},
  // The user settings, see @/store/index.js
  settings: {},
  // Temporary variables
  temp: {},

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
      let cursor = this.cursor = data.cursor
      this.settings = data.settings

      this.$refs.cursor.style.display = 'block'
      this.$refs.cursor.style.left = `${cursor.position.left}px`
      this.$refs.cursor.style.top = `${cursor.position.top}px`

      if (cursor.isDown) {
        this.$refs.cursor.classList.add('browsehandsfree-pulse')
      } else {
        this.$refs.cursor.classList.remove('browsehandsfree-pulse')
      }

      this.methods.runUserscripts.apply(this)
    },

    /**
     * Updates the set of userscripts
     * @param {ARR} userscripts The collection of userscripts
     */
    updateUserscripts (userscripts) {
      this.userscripts = userscripts
    },

    /**
     * Goes through all the userscripts
     */
    runUserscripts () {
      let bhf = this
      let $el = document.elementFromPoint(this.cursor.position.left, this.cursor.position.top)
      let $ = jQuery

      if ($el) $el = $($el)

      this.userscripts.forEach((script) => {
        try {
          eval(script.code)
        } catch (e) {
          console.error(e)
        }
      })
    }
  }
}

BrowseHandsfree.$refs.cursor.id = 'browsehandsfree-cursor'
document.body.appendChild(BrowseHandsfree.$refs.cursor)

/**
 * Listen for cursor updates
 */
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (!msg.browsehandsfree) return
  BrowseHandsfree.methods[msg.method].call(BrowseHandsfree, msg.data)
})
