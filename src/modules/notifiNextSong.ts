import notification from './notification'
import { BrowserWindow } from 'electron';

const _GetTrack = `
  ;(function(){
    let trackName, trackVer;
    if(/radio/.test(location.hostname)){
      trackName = document.querySelector('.player-controls__title') && document.querySelector('.player-controls__title').getAttribute('title') || ''
      return trackName
    }

    trackName = document.querySelector('.track__title') && document.querySelector('.track__title').textContent || ''
    trackVer = (document.querySelector('.track__ver') && document.querySelector('.track__ver').textContent) || ''
    return trackName + ' ' + trackVer
  })();
`;
const _GetArtist = `
  ;(function(){
    let trackArtist;
    if(/radio/.test(location.hostname)){
      trackArtist = document.querySelector('.player-controls__artists') && document.querySelector('.player-controls__artists').getAttribute('title') || ''
      return trackArtist
    }

    trackArtist = document.querySelectorAll('.track__artists a')
    return Array.from(trackArtist).map((e)=> e.textContent).join(', ')
  })();
`;
const _GetImg = `
  ;(function(){
    let trackImg;
    if(/radio/.test(location.hostname)){
      trackImg = document.querySelector('.slider__item_playing .track__cover') && document.querySelector('.slider__item_playing .track__cover').style.backgroundImage || ''
      return 'https:' + trackImg.replace('url("','').replace('")','').replace(/\d+x\d+/, '100x100')
    }

    trackImg = document.querySelector('.track-cover img') && document.querySelector('.track-cover img').getAttribute('src') || ''
    return 'https:' + trackImg.replace(/\d+x\d+/, '100x100')
  })();
`;

export default (win: BrowserWindow) => {

  return sendNotifi

  function sendNotifi() {
    Promise.all([getInfoFromDOM(_GetTrack), getInfoFromDOM(_GetArtist), getInfoFromDOM(_GetImg)]).then((v) => {
      if (v[0] && v[1]) {
        notification(v[0], v[1], v[2]);
      }
    })
  }

  async function getInfoFromDOM(command: string) {
    let checkData = async () => {
      return await win.webContents.executeJavaScript(command);
    }
    return await checkData()
  }
}

// Util
// function delay(millis) {
//   return new Promise((resolve) => setTimeout(resolve, millis));
// }
