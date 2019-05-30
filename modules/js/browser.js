const {
  ipcRenderer,
  webFrame,
  shell
} = require('electron');

const el = {
  prefButton: '.page-root .settings',
  prefDialog: '.settings-stream.popup',
  mute: '.page-root .volume',
  play: '.page-station .player-controls__play',
  next: '.page-station .slider__item_next',
  prev: '.page-station .slider__item_prev',
  like: '.page-station .button.like_action_like',
  dislike: '.page-station .button.like_action_dislike',
  activeStation: '.page-index .station_playing'
};

function exec(command) {
  webFrame.executeJavaScript(`if (!window.a) a = new Mu.Adapter(); ${command};`);
}

function click(s) {
  const e = document.querySelector(s);
  if (e) {
    e.click();
  }
}

ipcRenderer.on('play', () => exec('a.togglePause()'));
ipcRenderer.on('next', () => exec('a.next()'));
ipcRenderer.on('prev', () => click(el.prev));
ipcRenderer.on('like', () => click(el.like));
ipcRenderer.on('dislike', () => click(el.dislike));
ipcRenderer.on('mute', () => exec('a.mute()'));
ipcRenderer.on('HQ', () => exec('a.toggleHQ()'));

// Remove href from yandex logo
document.onreadystatechange = () => {
  $('div.footer__left').find('.link').removeAttr('href');
  $('div.nav__level').find('.footer__static-text').find('.link').removeAttr('href');
}

// Init function loader
document.addEventListener("DOMContentLoaded", () => {
  if (/radio/.test(location.origin)) {
    initRadio();
  } else if (/music/.test(location.origin)) {
    initMusic();
  }
});

// Yandex.Radio init function
function initRadio() {
  addSwitcher('', 'no__active');

  // add href to rep github
  let appendElement = $('<div class="footer__static-text"><a class="link link_pale">GitHub</a></div>').click(() => {
    shell.openExternal('https://github.com/dedpnd/yaradio-yamusic');
  });

  $('div.footer__right').append(appendElement);

  // add HQ element
  let HQElement = $('<div class="hqRadio__icon" title="Включить высокое качество"></div>').click(() => {
    exec('a.toggleHQ()');
  });

  $('div.head__right').prepend(HQElement);
}

// Yandex.Music init function
function initMusic() {
  addSwitcher('no__active', '');
}

// Switching between radio and music
function addSwitcher(yandexRadioClass, yandexMusicClass) {
  let divBlock = document.createElement("div");
  divBlock.className = 'block-selector';
  divBlock.innerHTML = `
      <div class="yaradio ${yandexRadioClass}"></div>
      <div class="yamusic ${yandexMusicClass}"></div>
    `;

  if (yandexMusicClass) {
    divBlock.style.left = '5rem'
  }

  divBlock.querySelector('.yaradio').onclick = () => {
    window.location = 'https://radio.yandex.ru/'
  };
  divBlock.querySelector('.yamusic').onclick = () => {
    window.location = 'https://music.yandex.ru/'
  };

  let pageRoot = document.querySelector('.page-root');

  // For yandex.music, because overlay playlist
  if (pageRoot.querySelector('.head.deco-pane')) {
    pageRoot.insertBefore(divBlock, pageRoot.querySelector('.head').nextSibling);
    return
  }

  pageRoot.insertBefore(divBlock, pageRoot.querySelector('.overlay'));
}
