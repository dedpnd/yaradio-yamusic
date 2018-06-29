const path = require('path');
const store = require('../store/store');
const { Menu, Tray } = require('electron');

const iconPath = path.join(__dirname,'../../','media/icon','yaradio.png');

function ctxTpl(win, app) {
  return [
		{
			label: 'Play | Pause',
			click: function (e) { return win.send('play')	}		
		},
    {
			label: 'Next Track',
			click: () => win.send('next')			
		},
		{
			type: 'separator'
		},
		{
			label: 'Like', 
			click: () => win.send('like')
		},
		{
			label: 'Dislike', 
			click: () => win.send('dislike')
		},
		{
			type: 'separator'
		},
		{
			label: 'Show App', click: function () {
				win.show();
			}
		},
		{
			label: 'Quit', click: function () {		        	
				app.quit();
			}
		}
  ]
}

exports.create = (win, app) => {
  const ctxMenu = Menu.buildFromTemplate(ctxTpl(win, app));
  const appIcon = new Tray(iconPath);
  
	appIcon.setContextMenu(ctxMenu);	
	appIcon.addListener('click', (e)=>{		
		e.preventDefault();
		if (win.isVisible()){
			win.hide();
		} else {
			win.show();
		}
	})

  win.on('show', function () {
		appIcon.setHighlightMode('always')
	})

}