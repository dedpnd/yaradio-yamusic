import * as path from "path";
import { IpcRenderer, BrowserWindow, Menu, Tray, App } from "electron";

const iconPath = path.join(__static, "img/icons", "16x16.png");
let appIcon = null;

function toggleWindowVisibility(win: BrowserWindow) {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
  }
}

function getCtxTpl(win: IpcRenderer & BrowserWindow, app: App): any {
  return [
    {
      label: "Play | Pause",
      click: () => win.send("play"),
    },
    {
      label: "Next Track",
      click: () => win.send("next"),
    },
    {
      type: "separator",
    },
    {
      label: "Like",
      click: () => win.send("like"),
    },
    {
      label: "Dislike",
      click: () => win.send("dislike"),
    },
    {
      type: "separator",
    },
    {
      label: "Show/Hide App",
      click: function () {
        toggleWindowVisibility(win);
      },
    },
    {
      label: "Quit",
      click: function () {
        app.quit();
      },
    },
  ];
}

export default (win: BrowserWindow, app: App) => {
  const ctxTpl = getCtxTpl(win as IpcRenderer & BrowserWindow, app);
  const ctxMenu = Menu.buildFromTemplate(ctxTpl);

  appIcon = new Tray(iconPath);
  appIcon.setContextMenu(ctxMenu);

  appIcon.addListener("click", (e) => {
    e.preventDefault();
    toggleWindowVisibility(win);
  });
};
