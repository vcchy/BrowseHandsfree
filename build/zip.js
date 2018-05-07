/**
 * This command zips up the dist for chrome
 */
'use strict'

const ora = require('ora')
const path = require('path')
const fs = require('fs')
const zip = new require('jszip')()
const configs = {
  webpack: require('../config'),
  app: require('../src/config.json')
}
const spinner = ora(`Zipping up chrome extension ${configs.app.version}`)
spinner.start()

zip
  .folder(configs.webpack.build.assetsRoot)
  .generateNodeStream({type: 'nodebuffer', streamFiles: true})
  .pipe(fs.createWriteStream(`${configs.webpack.build.assetsRoot}/browsehandsfree-chrome-extension-${configs.app.version}.zip`))
  .on('finish', function () {
    spinner.stop()
  })
