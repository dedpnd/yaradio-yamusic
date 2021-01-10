import Store from "electron-store";
import { Rectangle } from "electron";

interface StoreType {
  settings: {
    notifications: boolean;
    proxy: {
      protocol: string | null;
      url: string | null;
    };
  };
  lastApp: string | null;
  lastWindowState: Rectangle | null;
  "quit?": boolean;
}

const store = new Store({
  defaults: {
    settings: {
      notifications: true,
      proxy: {
        protocol: null,
        url: null
      }
    },
    lastApp: null,
    lastWindowState: null,
    "quit?": false
  }
});

store.set("quit?", false);

export default store as Store<StoreType>;
