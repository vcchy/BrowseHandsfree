document.getElementById('start-browsehandsfree').addEventListener('click', () => {
  chrome.windows.create({
    url: '/index.html',
    state: 'maximized'
  })
})
