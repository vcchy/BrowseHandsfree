<h1 align="center">
  <br>
  <a href="https://browsehandsfree.com"><img src="https://i.imgur.com/7XjWCf1m.png" alt="BrowseHandsfree"></a>
  <br>
</h1>

<h4 align="center">A platform for browsing the web hands-free (via face tracking)!</h4>

<p align="center"><a href="#about">About</a> • <a href="#building">Building</a> • <a href="#links">Links</a> • <a href="#privacy">Privacy</a> • <a href="#license">License</a>

## About
**BrowseHandsfree** is a platform that lets you browse the web hands-free. It does this via face tracking through your webcam, positioning a cursor over the part of the screen that your face is pointed at.

This project currently uses the trial version of [BRFv4](https://tastenkunst.github.io/brfv4_docs/), and we'll be using [Tensorflow.js](https://js.tensorflow.org/) to train custom gestures. The project is built on top of [VueJS](https://vuejs.org/).

### Contributing and Hacking
Please visit our [Trello Board](https://trello.com/b/deTJHd39/browser-extension) to see what tasks are available. When working on a task, please create the task in a separate branch (name it whatever you'd like for now).

Pull requests are merged into `dev`, which is eventually merged into `master`. `master` reflects what's deployed.

## Building
The only core dependency required to build the project is [NodeJS](https://nodejs.org/en/download/). Then:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Links
* [Trello Project Management Board](https://trello.com/b/vAsQoO6P/chrome-extension)
* [Twitter @labofoz](https://twitter.com/labofoz)
* [Twitter @BrowseHandsfree](https://twitter.com/browsehandsfree)
* Contact Oz Ramos at: labofoz [at] gmail [dot] com

## Privacy
Under no circumstance do we store, look at, or transmit anything - partially or fully - that happens on your feed other than to control the browser.

The webcam is fed into a set of machine learning algorithms packaged as a [library called BRFv4](https://tastenkunst.github.io/brfv4_docs/). Because BRFv4 is a commercial library (of which we are running the free trial), a single check to Tastenkunst's server is made to validate the trial license. However, all of the calculations required to position the mouse cursor happen within your browser.

These calculations (cursor position and click state) is then injected into your browsers active tab. **This data _can_ potentially be read by the visited site.**

Lastly, we don't use client-side analytics, trackers, or any other personal identification libraries. We actually don't even have server-side analytics yet.

## License
Copyright 2018 Oz Ramos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
