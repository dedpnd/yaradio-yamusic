import * as path from 'path';
import store from '../store';
import notification from '../notification';
import { IpcRenderer, BrowserWindow, Menu, Tray, App } from 'electron';

const iconPath = path.join(__dirname, '../../../', 'media/icon', 'yaradio_16x16.png');
let appIcon = null;

function getCtxTpl(win: IpcRenderer & BrowserWindow, app: App): any {
	const _SettingsNotifications = store.get('settings').notifications;

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
				checked: _SettingsNotifications,
				click: () => {
					const value = !store.get('settings').notifications;

					notification('Settings', value ? 'Notification enabled' : 'Notification disabled', null, true);
					store.set('settings', { notifications: value });
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

function toggleWindowVisibility(win: BrowserWindow) {
	if (win.isVisible()) {
		win.hide();
	} else {
		win.show();
	}
}

export default (win: BrowserWindow, app: App) => {
	const ctxTpl = getCtxTpl(win as IpcRenderer & BrowserWindow, app)
	const ctxMenu = Menu.buildFromTemplate(ctxTpl);

	appIcon = new Tray(iconPath);
	appIcon.setContextMenu(ctxMenu);

	appIcon.addListener('click', (e) => {
		e.preventDefault();
		toggleWindowVisibility(win);
	})
}
