/**
 * Positions the cursor
 */
function updateCursor (data) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        browsehandsfree: true,
        method: 'updateCursor',
        data: data
      })
    })
  })
}
