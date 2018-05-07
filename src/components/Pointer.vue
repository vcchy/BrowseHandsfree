<template lang="pug">
  #pointer(ref='pointer' :class='{hidden: !isTracking || !isWebcamOn, pulse: gesture.click === 1}')
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState([
      'brf',
      'chromeBgPage',
      'cursor',
      'gesture',
      'isTracking',
      'isWebcamOn',
      'lastFace',
      'refs',
      'settings'
    ]),

    data () {
      return {
        // List of points being worked on
        point: {},

        // The pointer color
        color: '#ff0000'
      }
    },

    watch: {
      lastFace (face) { this.drawCursor(face) },
      'gesture.click' (click) { if (click === 1) this.triggerClick() }
    },

    mounted () { this.$store.commit('merge', ['refs', {pointer: this.$refs.pointer}]) },

    methods: {
      /**
       * Draws the cursor
       *
       * @param {OBJ} face The face to draw for
       */
      drawCursor (face) {
        const $feed = this.refs.feed
        if (!$feed) return

        face = face.face
        const ratio = {
          width: window.innerWidth / $feed.width,
          height: window.innerHeight / $feed.height
        }
        // The canvas is mirrored, so left needs a few more operations
        let left = -face.translationX * ratio.width + $feed.width + parseInt(this.settings.offset.x) - this.settings.cursor.size / 2
        let top = face.translationY * ratio.height + parseInt(this.settings.offset.y) - this.settings.cursor.size / 2

        left += Math.sin(face.rotationY) * (this.settings.speed.x * window.innerWidth) + $feed.offsetLeft
        top += Math.sin(face.rotationX) * (this.settings.speed.y * window.innerHeight)

        this.refs.pointer.style = `left: ${left}px; top: ${top}px; width: ${this.settings.cursor.size}px; height: ${this.settings.cursor.size}px; border-radius: ${this.settings.cursor.size}px; background: ${this.color}`
        this.$store.commit('merge', ['cursor', {position: {left, top}}])

        this.detectSmile(face)
        this.maybeScrollPage()
        this.sendMessageToExtension()
      },

      /**
       * Attempts to detect clicks
       *
       * @param {OBJ} face The current face object
       */
      detectSmile (face) {
        this.point[0] = new this.brf.Point()
        this.point[1] = new this.brf.Point()

        // Mouth corner left
        this.setPoint(face.vertices, 48, 0)
        // Mouth corner right
        this.setPoint(face.vertices, 54, 1)
        let mouthWidth = this.calcDistance(this.point[0], this.point[1])

        // Left inner eye corner
        this.setPoint(face.vertices, 39, 1)
        // right outer eye corner
        this.setPoint(face.vertices, 42, 0)
        let eyeDist = this.calcDistance(this.point[0], this.point[1])

        // 1.4 = neutral, 1.7 = smiling
        let clickFactor = mouthWidth / eyeDist - this.settings.click.sensitivity

        // Create artificial breakpoints
        if (clickFactor >= 0) clickFactor = 1

        this.$store.commit('merge', ['gesture', {click: clickFactor}])
        this.$store.dispatch('updateClick')
        this.color = `rgb(255, ${clickFactor * 255}, 0)`
      },

      /**
       * Sets a points position
       *
       * @param {OBJ} vertices  The vertcies
       * @param {INT} i  The vertex to work with. v[i]
       * @param {OBJ} p  The point to work with. this.point[p]
       */
      setPoint (vertices, i, p) {
        let point = this.point[p]
        point.x = vertices[i * 2]
        point.y = vertices[i * 2 + 1]
      },

      /**
       * Calculate the distance between two points
       *
       * @param  {OBJ} p0 The first point
       * @param  {OBJ} p1 The second point
       */
      calcDistance (p0, p1) {
        return Math.sqrt(
          (p1.x - p0.x) * (p1.x - p0.x) +
          (p1.y - p0.y) * (p1.y - p0.y)
        )
      },

      /**
       * Triggers a click
       */
      triggerClick () {
        const $el = document.elementFromPoint(this.cursor.position.left, this.cursor.position.top)

        if ($el) {
          const ev = document.createEvent('MouseEvent')
          let eventName = 'click'

          if ($el.nodeName === 'INPUT' || $el.nodeName === 'TEXTAREA') {
            eventName = 'focus'
            $el.focus()
          }

          ev.initMouseEvent(eventName, true, true, window, null, this.cursor.position.left, this.cursor.position.top, 0, 0, false, false, false, false, 0, null)
          $el.dispatchEvent(ev)
        }
      },

      /**
       * Maybe scrolls the page
       */
      maybeScrollPage () {
        let scrollBy = {
          x: 0,
          y: 0
        }

        // Vertical Scroll
        if (this.cursor.position.top < 0) {
          scrollBy.y = this.cursor.position.top
        } else if (this.cursor.position.top > window.innerHeight) {
          scrollBy.y = this.cursor.position.top - window.innerHeight
        }
        // Horiz Scroll
        if (this.cursor.position.left < 0) {
          scrollBy.x = this.cursor.position.left
        } else if (this.cursor.position.left > window.innerWidth) {
          scrollBy.x = this.cursor.position.left - window.innerWidth
        }

        scrollBy.x *= this.settings.scroll.sensitivity
        scrollBy.y *= this.settings.scroll.sensitivity
        scrollBy && window.scrollBy(scrollBy.x, scrollBy.y)
      },

      /**
       * Sends data to our extensions
       */
      sendMessageToExtension () {
        this.chromeBgPage && this.chromeBgPage.updateCursor({
          cursor: this.cursor,
          face: this.lastFace,
          gesture: this.gesture,
          settings: this.settings
        })
      }
    }
  }
</script>
