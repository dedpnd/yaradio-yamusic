import { ipcMain, session } from "electron";
import store from "./store";

async function SetProxy() {
  const _SettingsProxy = store.get("settings").proxy;
  if (_SettingsProxy.protocol && _SettingsProxy.url) {
    await session.fromPartition("persist:webviewsession").setProxy({
      proxyRules: `${_SettingsProxy.protocol}://${_SettingsProxy.url}`,
    });
  }
}

ipcMain.on("SetProxy", async (event) => {
  await SetProxy();
  event.returnValue = null;
});

export default SetProxy;
