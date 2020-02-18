import { app, globalShortcut, IpcRenderer, BrowserWindow, App } from 'electron';

function shortcutTpl(win: IpcRenderer & BrowserWindow) {
  return [{
    accelerator: 'MediaPlayPause',
    func: () => win.send('play'),
  },
  {
    accelerator: 'MediaNextTrack',
    func: () => win.send('next'),
  },
  {
    accelerator: 'MediaPreviousTrack',
    func: () => win.send('prev'),
  },
  {
    accelerator: 'VolumeMute',
    func: () => win.send('mute'),
  },
  {
    accelerator: "CmdOrCtrl+Q",
    func: () => app.quit(),
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