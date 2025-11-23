<template>
  <v-app>
    <div class="app-bar-hover" tabindex="0">
      <v-app-bar
        color="deep-purple lighten-1"
        dark
        class="app-bar-slide"
        dense
        flat
      >
        <div class="d-flex align-center">
          <v-btn to="/music" @click="openHomePage" text tile>
            <v-img
              alt="Yandex Music"
              contain
              :src="yamusicLogo"
              transition="scale-transition"
              width="32"
              style="top: -3px"
            />
          </v-btn>
          <v-btn to="/radio" text tile>
            <v-img
              alt="Yandex Radio"
              contain
              :src="yaradioLogo"
              transition="scale-transition"
              width="32"
            />
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" persistent max-width="600px" scrollable>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="getStoreValue" text>
              <v-icon large>$settings</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Settings</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 360px">
            <v-container>
              <v-row>
                <v-col cols="12" class="pb-0">
                  <div class="label-box label-box__without_btn ma-0">
                    <h3>Notifications</h3>
                  </div>
                  <v-checkbox
                    v-model="allowNotification"
                    label="Enable"
                    class="pa-0 ma-2"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12">
                  <div class="label-box">
                    <h3>Proxy</h3>
                    <v-btn text right @click="clearProxy">
                      <v-icon>$delete</v-icon>
                    </v-btn>
                  </div>
                  <v-row>
                    <v-col cols="3">
                      <v-select
                        v-model="protocol"
                        :items="itemsProtocol"
                        label="Protocol"
                        class="pt-2 pl-2"
                      ></v-select>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        v-model="url"
                        label="127.0.0.1:5050"
                        single-line
                        class="pt-2"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <div class="label-box label-box__without_btn">
                    <h3>Key shortcut</h3>
                  </div>
                  <v-col>
                    <v-row>
                      <v-checkbox
                        v-model="gsPlay"
                        label="Play | Pause"
                        class="pa-0 ml-2"
                        v-on:change="getAlert"
                      ></v-checkbox>
                    </v-row>
                    <v-row>
                      <v-checkbox
                        v-model="gsNextTrack"
                        label="Next track"
                        class="pa-0 ma-0 ml-2"
                        v-on:change="getAlert"
                      ></v-checkbox>
                    </v-row>
                    <v-row>
                      <v-checkbox
                        v-model="gsPrevTrack"
                        label="Previous track"
                        class="pa-0 ma-0 ml-2"
                        v-on:change="getAlert"
                      ></v-checkbox>
                    </v-row>
                    <v-row>
                      <v-checkbox
                        v-model="gsMute"
                        label="Mute"
                        class="pa-0 ma-0 ml-2"
                        v-on:change="getAlert"
                      ></v-checkbox>
                    </v-row>
                    <v-row>
                      <v-checkbox
                        v-model="gsExit"
                        label="Exit"
                        class="pa-0 ma-0 ml-2"
                        v-on:change="getAlert"
                      ></v-checkbox>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
            </v-container>
            <small>
              You can support me :)
              <v-btn @click="externalSupport" text>
                <v-icon medium>$cash</v-icon>
              </v-btn>
              <br />
              Copyright 2019-2022 ©
              <a
                href="https://github.com/dedpnd/yaradio-yamusic"
                target="_blank"
                >dedpnd</a
              >
            </small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Close </v-btn>
            <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </v-app-bar>
    </div>

    <v-main class="main-with-hover-gap">
      <Home />
    </v-main>
    <v-alert
      v-model="alert"
      border="bottom"
      close-text="Close Alert"
      color="deep-purple accent-4"
      dark
      dismissible
      style="position: absolute; bottom: 0px; left: 20%; right: 20%"
    >
      It is recommended to restart the application for correct work
    </v-alert>
  </v-app>
</template>

<style>
@import "~@mdi/font/css/materialdesignicons.css";

html {
  overflow-y: hidden !important;
}
.label-box {
  border-color: #7e57c2;
  border-style: solid;
  border-width: 0 0 thin 0;
}
.label-box__without_btn {
  padding-bottom: 13px;
}
.label-box > h3 {
  display: contents;
}
.label-box > button {
  position: sticky;
  left: 100%;
}
.v-messages {
  min-height: 0px im !important;
}
.app-bar-hover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  z-index: 20;
  background: linear-gradient(rgba(103, 58, 183, 0.25), rgba(103, 58, 183, 0));
}
.app-bar-slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transform: translateY(-100%) !important;
  transition: transform 0.25s ease;
  z-index: 10;
  pointer-events: none;
}
.app-bar-hover:hover .app-bar-slide {
  transform: translateY(0) !important;
  pointer-events: auto;
}
.app-bar-hover:focus-within .app-bar-slide {
  transform: translateY(0) !important;
  pointer-events: auto;
}
.main-with-hover-gap {
  padding-top: 0;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer, shell } from "electron";
import Home from "./components/Home.vue";
import Store from "./store";
import storeElectron from "./electron/store";
import yamusicLogo from "@/media/yamusic_64x64.png";
import yaradioLogo from "@/media/yaradio_64x64.png";

export default defineComponent({
  name: "App",
  components: { Home },
  data: () => ({
    dialog: false,
    allowNotification: false,
    itemsProtocol: ["http", "https", "socks4", "socks5"],
    protocol: null as string | null,
    url: null as string | null,
    gsPlay: false,
    gsNextTrack: false,
    gsPrevTrack: false,
    gsMute: false,
    gsExit: false,
    alert: false,
    yamusicLogo,
    yaradioLogo,
  }),
  methods: {
    externalSupport() {
      shell.openExternal("https://www.tinkoff.ru/sl/6XuoF9Bz5bk");
    },
    openHomePage() {
      const exec = async (args: string) => {
        const webview: any = document.querySelector("webview");

        if (webview && !Store.state.loading) {
          await webview.executeJavaScript(`
            innerRoute('${args}')
          `);
        }
      };

      exec("/");
    },
    getStoreValue() {
      const settings = storeElectron.get("settings");

      this.allowNotification = settings.notifications;
      if (settings.proxy) {
        this.protocol = settings.proxy.protocol;
        this.url = settings.proxy.url;
      }
      if (settings.gs) {
        this.gsPlay = settings.gs.play;
        this.gsNextTrack = settings.gs.nextTrack;
        this.gsPrevTrack = settings.gs.prevTrack;
        this.gsMute = settings.gs.mute;
        this.gsExit = settings.gs.exit;
      }
    },
    close() {
      this.allowNotification = false;
      this.protocol = null;
      this.url = null;
      this.dialog = false;
      this.gsPlay = false;
      this.gsNextTrack = false;
      this.gsPrevTrack = false;
      this.gsMute = false;
      this.gsExit = false;
    },
    clearProxy() {
      this.protocol = null;
      this.url = null;
    },
    getAlert() {
      this.alert = true;
    },
    save() {
      storeElectron.set("settings", {
        notifications: this.allowNotification,
        proxy: {
          protocol: this.protocol,
          url: this.url,
        },
        gs: {
          play: this.gsPlay,
          nextTrack: this.gsNextTrack,
          prevTrack: this.gsPrevTrack,
          mute: this.gsMute,
          exit: this.gsExit,
        },
      });

      ipcRenderer.sendSync("SetProxy");

      this.dialog = false;
    },
  },
});
</script>
