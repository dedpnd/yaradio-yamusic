"use strict";

import * as path from "path";
import { app, protocol, session, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

import store from "./electron/store";
import ctxMenu from "./electron/menu";
import globalShortcut from "./electron/globalShortcut";
import notification from "./electron/notification";
import proxy from "./electron/proxy";

const isDevelopment = process.env.NODE_ENV !== "production";
const _defaultHeight = 620;
const _defaultWidth = 820;

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win: BrowserWindow | null = null;
const appRunning = app.requestSingleInstanceLock();

if (!appRunning) {
  app.quit();
}

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized() || !win.isVisible()) {
      win.restore();
    }
    win.focus();
  }
});

async function createWindow() {
  const lastWindowState = store.get("lastWindowState");

  win = new BrowserWindow({
    title: "YaMusic",
    x: lastWindowState ? lastWindowState.x : 100,
    y: lastWindowState ? lastWindowState.y : 100,
    height: lastWindowState ? lastWindowState.height : _defaultHeight,
    width: lastWindowState ? lastWindowState.width : _defaultWidth,
    icon: path.join(__static, "icon.png"),
    minHeight: _defaultHeight,
    minWidth: _defaultWidth,
    autoHideMenuBar: true,
    backgroundColor: "#ECEFF1",
    webPreferences: {
      webviewTag: true,
      zoomFactor: 1.0,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }

  win.on("close", (e) => {
    if (!store.get("quit?")) {
      e.preventDefault();
    }

    if (win) {
      switch (process.platform) {
        case "win32":
        case "linux":
          win.hide();
          break;
        case "darwin":
          app.hide();
          break;
        default:
      }
    }
  });

  return win;
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  if (
    isDevelopment &&
    !process.env.IS_TEST &&
    process.env.VUE_DEVTOOLS === "1"
  ) {
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

  session
    .fromPartition("persist:webviewsession")
    .webRequest.onBeforeRequest(
      { urls: ["*://*/*"] },
      (details: any, callback) => {
        if (
          details.url.includes("awaps.yandex.net") ||
          details.url.includes("vh-bsvideo-converted") ||
          details.url.includes("get-video-an") ||
          details.url.includes("an.yandex.ru/vmap") ||
          details.url.includes("yandex.ru/an") ||
          details.url.includes("mc.yandex.ru/watch") ||
          details.url.includes("strm.yandex.ru") ||
          details.url.includes("mc.yandex.ru/clmap") ||
          details.url.includes("yandex.ru/ads")
        ) {
          return { cancel: true };
        }
        if (details.url.includes("start?__t")) {
          notification(win);
        }

        callback({});
      }
    );
});

app.on("before-quit", () => {
  store.set("quit?", true);
  if (win) {
    if (!win.isFullScreen()) {
      store.set("lastWindowState", win.getBounds());
    }

    store.set("lastApp", win.getTitle());
  }
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
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
