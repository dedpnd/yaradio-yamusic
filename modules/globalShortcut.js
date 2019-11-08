const {
  app,
  globalShortcut
} = require('electron');

function shortcutTpl(win) {
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

exports.init = (win, app) => {
  const tplShortcut = shortcutTpl(win);

  tplShortcut.forEach((e)=>{
    globalShortcut.register(e.accelerator, e.func);
  })

  app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  })
}