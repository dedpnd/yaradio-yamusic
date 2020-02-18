import * as Store from 'electron-store';
import { Rectangle } from 'electron'

interface IStore {
  settings: {
    notifications: boolean;
  };
  lastApp: string | null;
  lastWindowState: Rectangle | null;
  'quit?': boolean;
}

const store = new Store({
  defaults: {
    settings: {
      notifications: true
    },
    lastApp: null,
    lastWindowState: null,
    'quit?': false
  }
});

store.set('quit?', false);

export default (store as Store<IStore>)