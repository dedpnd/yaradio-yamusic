import Store from "electron-store";
import { Rectangle } from "electron";


interface StoreType {
  settings: {
    notifications: boolean;
    proxy: {
      protocol: string | null;
      url: string | null;
    };
    gs: {
      play: boolean;
      nextTrack: boolean;
      prevTrack: boolean;
      mute: boolean;
      exit: boolean;
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
      },
      gs: {
        play: true,
        nextTrack: true,
        prevTrack: true,
        mute: true,
        exit: true
      }
    },
    lastApp: null,
    lastWindowState: null,
    "quit?": false
  }
});

store.set("quit?", false);

// #HotFix 1.0.1
if (!store.get("settings.gs")) {
  store.set("settings.gs", {
    play: true,
    nextTrack: true,
    prevTrack: true,
    mute: true,
    exit: true
  });
}

export default store as Store<StoreType>;
