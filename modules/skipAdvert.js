const {
  session
} = require('electron');

exports.init = () => {
  session.defaultSession.webRequest.onBeforeRequest(['*'], (details, callback) => {
    if (/awaps.yandex.net/.test(details.url) || /vh-bsvideo-converted/.test(details.url) || /get-video-an/.test(details.url)) {
      return {
        cancel: true
      }
    }
    callback(details);
  })
}