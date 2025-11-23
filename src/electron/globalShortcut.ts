import { app, globalShortcut, IpcRenderer, BrowserWindow, App } from "electron";
import store from "./store";

function shortcutTpl(win: IpcRenderer & BrowserWindow) {
  return [
    {
      accelerator: "MediaPlayPause",
      enabled: store.get("settings.gs.play"),
      func: () => {
        win.send("play");
      },
    },
    {
      accelerator: "MediaNextTrack",
      enabled: store.get("settings.gs.nextTrack"),
      func: () => {
        win.send("next");
      },
    },
    {
      accelerator: "MediaPreviousTrack",
      enabled: store.get("settings.gs.prevTrack"),
      func: () => {
        win.send("prev");
      },
    },
    {
      accelerator: "VolumeMute",
      enabled: store.get("settings.gs.mute"),
      func: () => {
        win.send("mute");
      },
    },
    {
      accelerator: "CmdOrCtrl+Q",
      enabled: store.get("settings.gs.exit"),
      func: () => {
        app.quit();
      },
    },
  ];
}

export default (win: BrowserWindow, app: App) => {
  const tplShortcut = shortcutTpl(win as IpcRenderer & BrowserWindow);

  tplShortcut.forEach((e) => {
    if (e.enabled) {
      globalShortcut.register(e.accelerator, e.func);
    }
  });

  app.on("will-quit", () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  });
};
