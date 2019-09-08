const path = require('path');
const store = require('../store/store');
const notification = require('../notification/notification');
const { Menu, Tray } = require('electron');

const iconPath = path.join(__dirname, '../../', 'media/icon', 'yaradio_16x16.png');

function ctxTpl(win, app) {
	return [
		{
			label: 'Play | Pause',
			click: () => win.send('play')
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
			label: 'Show/Hide App',
			click: function () {
				toggleWindowVisibility(win);
			}
		},
		{
			type: 'submenu',
			label: 'Settings',
			submenu: [{
				type: 'checkbox',
				label: 'Notification',
				checked: store.get('settings.notifications'),
				click: () => {
					let value = !store.get('settings.notifications');
					notification.notifi('Settings', value ? 'Notification enabled' : 'Notification disabled', null, true);

					store.set('settings.notifications', value);
				}
			}]
		},
		{
			label: 'Quit',
			click: function () {
				app.quit();
			}
		}
	]
}

function toggleWindowVisibility(win) {
	if (win.isVisible()) {
		win.hide();
	} else {
		win.show();
	}
}

exports.create = (win, app) => {

	const ctxMenu = Menu.buildFromTemplate(ctxTpl(win, app));

	const appIcon = new Tray(iconPath);

	appIcon.setContextMenu(ctxMenu);
	appIcon.addListener('click', (e) => {
		e.preventDefault();
		toggleWindowVisibility(win);
	})

	win.on('show', function () {
		appIcon.setHighlightMode('always')
	})

}
