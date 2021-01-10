import { ipcMain, Notification } from 'electron';
import * as path from 'path';
import fetch from 'electron-fetch'
import fs from 'fs';
import store from './store';

ipcMain.on('setTrackInfo', async (event, data) => {
  const _SettingsNotifications = store.get('settings').notifications;
  if (data && _SettingsNotifications) {
    await invoke(data.title, data.artists.map((e: any) => e.title).join(', '), data.cover);
  }

  event.returnValue = null;
})

async function invoke(title: string, msg: string, img: string) {
  let imgFile = path.join(__dirname, 'media', 'yaradio_64x64.png');
  
  try {
    if (img) {
      const pathToFile = path.join(__dirname, '../', '100x100.jpeg');
      const resImg = await fetch("http://" + img.replace("%%", "100x100"));
      await fs.promises.writeFile(pathToFile, await resImg.buffer(), { encoding: 'binary' });
      imgFile = pathToFile;
    }

    new Notification({
      title: title || 'YaMusic',
      body: msg || '-',
      icon: imgFile,
      silent: true,
    }).show();
  } catch (error) {
    console.log("Notifier has error: ", error);
  }
};

export default async (win: any) => {
  win.send("getTrackInfo")
}
