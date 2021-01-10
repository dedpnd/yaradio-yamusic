"use strict";

import * as path from 'path';
import { app, protocol, session, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

import store from './electron/store';
import ctxMenu from './electron/menu';
import globalShortcut from './electron/globalShortcut';
import notification from './electron/notification';
import proxy from './electron/proxy';

const isDevelopment = process.env.NODE_ENV !== "production";
const _defaultHeight = 707;
const _defaultWidth = 845;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

let win: BrowserWindow | null = null;
const appRunning = app.requestSingleInstanceLock();

if (!appRunning) {
  app.quit();
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized() || !win.isVisible()) {
      win.restore();
    }
    win.focus();
  }
})

async function createWindow() {
  const lastWindowState = store.get('lastWindowState');

  // Create the browser window.
  win = new BrowserWindow({
    title: 'YaRadio',
    x: lastWindowState ? lastWindowState.x : 100,
    y: lastWindowState ? lastWindowState.y : 100,
    height: lastWindowState ? lastWindowState.height : _defaultHeight,
    width: lastWindowState ? lastWindowState.width : _defaultWidth,
    icon: path.join(__static, 'icon.png'),
    titleBarStyle: 'hiddenInset',
    minHeight: _defaultHeight,
    minWidth: _defaultWidth,
    autoHideMenuBar: true,
    backgroundColor: '#ECEFF1', //TODO this
    webPreferences: {
      webviewTag: true, // Security warning since Electron 10
      zoomFactor: 1.0,
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean
      nodeIntegration: true,
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }

  win.on('close', e => {
    if (!store.get('quit?')) {
      e.preventDefault();
    }

    if (win) {
      switch (process.platform) {
        case 'win32':
          win.hide();
          break;
        case 'linux':
          win.hide();
          break;
        case 'darwin':
          app.hide();
          break;
        default:
      }
    }
  });

  return win
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }

  const win = await createWindow();

  ctxMenu(win, app);
  globalShortcut(win, app);
  await proxy();

  session.fromPartition('persist:webviewsession').webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, callback) => {
    if (details.url.includes("awaps.yandex.net") || details.url.includes("vh-bsvideo-converted") || details.url.includes("get-video-an")) {
      // Skip advertising
      return {
        cancel: true
      }
    }
    if (details.url.includes("start?__t")) {
      // Notification for next sing
      notification(win);
    }
    callback({});
  })
});

app.on('before-quit', () => {
  store.set('quit?', true);
  if (win) {
    if (!win.isFullScreen()) {
      store.set('lastWindowState', win.getBounds());
    }

    store.set('lastApp', win.getTitle());
  }
});



// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
