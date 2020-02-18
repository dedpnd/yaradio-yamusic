import * as path from 'path';
import * as notifier from 'node-notifier';
import store from '../store/store';
import * as rp from 'request-promise';
import * as fs from 'mz/fs';

export default async (title: string, msg: string, img: string | null, force?: boolean) => {
  const _SettingsNotifications = store.get('settings').notifications;

  let sendNotify = function () {
    notifier.notify({
      title: title || 'YaRadio',
      message: msg || '-',
      icon: img ? path.join(__dirname, '../../../media/tmp', '100x100.jpeg') : path.join(__dirname, '../../../media/icon', 'yaradio_64x64.png'),
      sound: false,
      wait: false
    }, function (err) {
      if (err) {
        console.log('Error: Notifier', err);
      }
    })
  }

  if (_SettingsNotifications) {
    if (img) {
      let dataImg = await rp.get(img, { encoding: 'binary' }).catch((err) => {
        console.log('Error: Notifier', err);
      })

      await fs.writeFile(path.join(__dirname, '../../../media/tmp', '100x100.jpeg'), dataImg, { encoding: 'binary' }).catch((err) => {
        console.log('Error: Notifier', err);
      })

      sendNotify();
      return
    }

    sendNotify();
  } else if (force) {
    sendNotify();
  }
}