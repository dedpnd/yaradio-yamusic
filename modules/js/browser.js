const { ipcRenderer, webFrame, shell } = require('electron');

const el = {
	prefButton: '.page-root .settings',
	prefDialog: '.settings-stream.popup',
	mute: '.page-root .volume',
	play: '.page-station .player-controls__play',
	next: '.page-station .slider__item_next',
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
ipcRenderer.on('like', () => click(el.like));
ipcRenderer.on('dislike', () => click(el.dislike));
ipcRenderer.on('mute', () => exec('a.mute()'));
ipcRenderer.on('HQ', () => exec('a.toggleHQ()'));

document.onreadystatechange = ()=>{ 
    //Remove href to yandex
    $('div.footer__left').find('.link').removeAttr('href');
    $('div.nav__level').find('.footer__static-text').find('.link').removeAttr('href');  
}

document.addEventListener("DOMContentLoaded", ()=>{   
  //Add href to GitHub
  let cloneFooterElement = null;
  $('div.footer__right').find('div').each((i,e)=>{     
    $(e).css('display', 'none');
  })

  let appendElement = $('<div class="footer__static-text"><a class="link link_pale">GitHub</a></div>').click(()=>{ 
    shell.openExternal('https://github.com/dedpnd/yaradio-yamusic');
  });
  $('div.footer__right').append(appendElement);
  
  //Add HQ
  let HQElement =  $('<div class="hq__icon" title="Включить высокое качество"></div>').click(()=>{ 
    exec('a.toggleHQ()');
  })
  $('div.head__right').prepend(HQElement);
});
