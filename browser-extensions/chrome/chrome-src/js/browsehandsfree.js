let $BrowseHandsfree = {
  cursor: document.createElement('div'),

  // Whether we have initialized the virtual keyboard yet
  hasInitedKeyboard: false,

  // Whether we've clicked the virtual keyboard or not
  wasKeyboardClicked: false,

  methods: {
    /**
     * Update the cursor position and handle gestures
     */
    updateCursor (data) {
      data = data.data
      const cursor = data.cursor
      const face = data.face
      const gesture = data.gesture
      const settings = data.settings
      const lastFrame = data.lastFrame

      this.curCycle = lastFrame
      this.updateSettings(settings)
      this.updateCursor(cursor)
      this.updateScroll(cursor, settings)
      this.fireEvents(cursor)

      if (!this.hasInitedKeyboard) this.initKeyboard()
    }
  },

  /**
   * Sets the settings
   */
  updateSettings (settings) {
    this.cursor.style.width = settings.cursor.size
    this.cursor.style.height = settings.cursor.size
    this.cursor.style.borderRadius = settings.cursor.size
  },

  /**
   * Updates the cursors position
   */
  updateCursor (cursor) {
    this.cursor.style.display = 'block'
    this.cursor.style.left = `${cursor.position.left}px`
    this.cursor.style.top = `${cursor.position.top}px`
  },

  /**
   * Updates the window scroll position
   */
  updateScroll (cursor, settings) {
    let scrollBy = {
      x: 0,
      y: 0
    }

    if (cursor.position.top < 0) {
      scrollBy.y = cursor.position.top
    } else if (cursor.position.top > window.innerHeight) {
      scrollBy.y = cursor.position.top - window.innerHeight
    }
    // Horiz Scroll
    if (cursor.position.left < 0) {
      scrollBy.x = cursor.position.left
    } else if (cursor.position.left > window.innerWidth) {
      scrollBy.x = cursor.position.left - window.innerWidth
    }

    scrollBy.x *= settings.scroll.sensitivity
    scrollBy.y *= settings.scroll.sensitivity
    scrollBy && window.scrollBy(scrollBy.x, scrollBy.y)
  },

  /**
   * Fires events on elements
   */
  fireEvents (cursor) {
    const $el = this.getTouchedElement(cursor)
    const isKeyboardElement = this.isKeyboardElement($el)

    // Click
    if (cursor.clicked && this.canClickKeyboard(isKeyboardElement)) {
      if ($el.nodeName === 'INPUT' || $el.nodeName === 'TEXTAREA') {
        this.fireEvent('focus', cursor)
      } else {
        this.fireEvent('click', cursor)
      }
      $el && !this.wasKeyboardClicked && this.isKeyboardElement($el) && setTimeout(() => { this.fireEvent('mouseup', cursor) }, 0)
    }

    // Mousedown
    if (!cursor.clicked && cursor.isDown && this.canClickKeyboard(isKeyboardElement)) {
      if ($el.nodeName === 'INPUT' || $el.nodeName === 'TEXTAREA') {
        this.fireEvent('focus', cursor)
      } else {
        this.fireEvent('mousedown', cursor)
      }
      $el && !this.wasKeyboardClicked && this.isKeyboardElement($el) && setTimeout(() => { this.fireEvent('mouseup', cursor) }, 0)
      this.wasKeyboardClicked = true
    }

    // Hover
    if (!cursor.clicked && !cursor.isDown) setTimeout(() => this.fireEvent('mouseover', cursor), 0)

    // Release the mouse click
    if (!cursor.clicked && !cursor.isDown && this.wasKeyboardClicked) {
      this.fireEvent('mouseup', cursor)
      this.wasKeyboardClicked = false
    }

    // Set color
    if (cursor.isDown) {
      this.cursor.classList.add('browsehandsfree-pulse')
      this.cursor.style.background = 'rgba(255, 255, 0, 0.85)'
    } else {
      this.cursor.classList.remove('browsehandsfree-pulse')
      this.cursor.style.background = 'rgba(255, 0, 0, 0.85)'
    }
  },

  /**
   * Fires a specific event
   * @param  {STR} eventName The name of the event to fire
   * @param  {OBJ} cursor    The cursor object
   */
  fireEvent (eventName, cursor) {
    const $el = this.getTouchedElement(cursor)

    if ($el) {
      // @see https://stackoverflow.com/questions/3277369/how-to-simulate-a-click-by-using-x-y-coordinates-in-javascript
      const ev = document.createEvent('MouseEvent')
      ev.initMouseEvent(eventName, true, true, window, null, cursor.position.left, cursor.position.top, 0, 0, false, false, false, false, 0, null)
      $el.dispatchEvent(ev)
    }
  },

  /**
   * Gets the element under the cursor
   */
  getTouchedElement (cursor) {
    return document.elementFromPoint(cursor.position.left, cursor.position.top)
  },

  /**
   * Checks if the element is a virtual keyboard element
   */
  isKeyboardElement ($el) {
    return $el && ($el.classList.contains('ui-keyboard-text')
      || $el.classList.contains('ui-keyboard-button'))
  },

  /**
   * Checks whether we can click the keyboard
   */
  canClickKeyboard (isKeyboardElement) { return (isKeyboardElement && !this.wasKeyboardClicked) || !isKeyboardElement },

  /**
   * Initializes the keyboard
   */
  initKeyboard () {
    /**
     * Attaches the virtual keyboard
     */
    jQuery(function () {
      setTimeout(function () {
        jQuery('input, textarea').keyboard()
      }, 500)
    })

    this.hasInitedKeyboard = true
  }
}

$BrowseHandsfree.cursor.id = 'browsehandsfree-cursor'
$BrowseHandsfree.cursor.style.background = 'rgba(255, 0, 0, 0.85)'
$BrowseHandsfree.cursor.style.border = '2px solid rgba(255, 0, 0, 0.85)'
$BrowseHandsfree.cursor.style.transformOrigin = 'center'
$BrowseHandsfree.cursor.style.width = '15px'
$BrowseHandsfree.cursor.style.height = '15px'
$BrowseHandsfree.cursor.style.borderRadius = '15px'
$BrowseHandsfree.cursor.style.opacity = 0.8
$BrowseHandsfree.cursor.style.position = 'fixed'
$BrowseHandsfree.cursor.style.display = 'none'
$BrowseHandsfree.cursor.style.zIndex = 9999999
document.body.appendChild($BrowseHandsfree.cursor)

/**
 * Listen for cursor updates
 */
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (!msg.browsehandsfree) return
  $BrowseHandsfree.methods[msg.method].call($BrowseHandsfree, msg)
})
