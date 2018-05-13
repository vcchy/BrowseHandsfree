import lockr from 'lockr'
import { merge } from 'lodash'

let settings = lockr.get('settings') || {}

settings = merge({
  cursor: {
    size: 15,

    // Number of frames a click is active for
    clickFrameBuffer: 1
  },

  offset: {
    x: 738,
    y: -232
  },

  click: {
    sensitivity: 1.46
  },

  scroll: {
    sensitivity: 0.4
  },

  typing: {
    speed: 20
  },

  speed: {
    x: 2.45,
    y: 2.5
  }
}, settings)

export default settings
