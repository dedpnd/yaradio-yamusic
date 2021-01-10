import { ipcMain, session } from "electron";
import store from './store';

ipcMain.on('SetProxy', async (event, data) => {
  await SetProxy();
  event.returnValue = null;
})

async function SetProxy() {
  const _SettingsProxy = store.get('settings').proxy;
  if (_SettingsProxy.protocol && _SettingsProxy.url) {
    await session.fromPartition('persist:webviewsession').setProxy({ proxyRules: `${_SettingsProxy.protocol}://${_SettingsProxy.url}` });
  }
}

export default SetProxy