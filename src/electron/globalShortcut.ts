import { app, globalShortcut, IpcRenderer, BrowserWindow, App } from 'electron';
import store from './store';

function shortcutTpl(win: IpcRenderer & BrowserWindow) {
  return [{
    accelerator: 'MediaPlayPause',
    func: () => {
      if (store.get('settings.gs.play')) {
        win.send('play')
      }
    },
  },
  {
    accelerator: 'MediaNextTrack',
    func: () => {
      if (store.get('settings.gs.nextTrack')) {
        win.send('next')
      }
    },
  },
  {
    accelerator: 'MediaPreviousTrack',
    func: () => {
      if (store.get('settings.gs.prevTrack')) {
        win.send('prev')
      }
    },
  },
  {
    accelerator: 'VolumeMute',
    func: () => {
      if (store.get('settings.gs.mute')) {
        win.send('mute')
      }
    },
  },
  {
    accelerator: "CmdOrCtrl+Q",
    func: () => {
      if (store.get('settings.gs.exit')) {
        app.quit()
      }
    },
  },
  ]
}

export default (win: BrowserWindow, app: App) => {
  const tplShortcut = shortcutTpl(win as IpcRenderer & BrowserWindow);

  tplShortcut.forEach((e) => {
    globalShortcut.register(e.accelerator, e.func);
  })

  app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  })
}
