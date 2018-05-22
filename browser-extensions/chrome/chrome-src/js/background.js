let userscripts = []

/**
 * Positions the cursor
 */
function updateCursor (data) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        browsehandsfree: true,
        method: 'updateCursor',
        data
      })
    })
  })
}

/**
 * Update the set of userscripts
 * @param {INT} tabId The tab to post the userscripts to
 */
function postUserscriptUpdates (tabId) {
  chrome.tabs.sendMessage(tabId, {
    browsehandsfree: true,
    method: 'updateUserscripts',
    data: userscripts
  })
}

/**
 * Called by the app to send userscripts to content page
 */
function updateUserscripts (data) {
  userscripts = data.userscripts

  chrome.tabs.query({active: true, currentWindow: false}, (tabs) => {
    tabs.forEach((tab) => {
      postUserscriptUpdates(tab.id)
    })
  })
}

chrome.tabs.onUpdated.addListener((tabId, info) => { info.status === 'complete' && postUserscriptUpdates(tabId) })
