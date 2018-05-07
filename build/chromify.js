/**
 * This command:
 * - Pieces together all the required files for a chrome extension
 * - Creates a .zip
 */
'use strict'

const ora = require('ora')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const assetRoot = require('../config').build.assetsRoot
const paths = {
  manifest: {
    dir: 'browser-extensions/chrome/',
    file: path.resolve(__dirname, `../browser-extensions/chrome/manifest.json`)
  },
  popup: `${assetRoot}/chrome-src/popup.html`
}
let PACKAGE = require('../package.json')
let MANIFEST = require(paths.manifest.file)
const version = PACKAGE.version
const spinner = ora(`Compiling Chrome Extension ${version}`)

spinner.start()

// Update manifest
MANIFEST.version = PACKAGE.version
fs.writeFileSync(paths.manifest.file, JSON.stringify(MANIFEST, null, 2), 'utf8', (err) => { if (err) return console.log(err) })

// Copy over files
fse.copySync(paths.manifest.dir, `${assetRoot}`)

// Update semver
fs.readFile(paths.popup, 'utf8', (err, data) => {
  if (err) return console.log(err)
  let result = data.replace(/\$CONFIG\.VERSION/g, version)
  fs.writeFileSync(paths.popup, result, 'utf8', (err) => { if (err) return console.log(err) })
})

spinner.stop()
