<template>
  <v-app>
    <v-app-bar app color="deep-purple lighten-1" dark>
      <div class="d-flex align-center">
        <v-btn to="/radio" text style="border-radius: 4px 0px 0px 4px">
          <v-img
            alt="Yandex Radio"
            contain
            src="./media/yaradio_64x64.png"
            transition="scale-transition"
            width="32"
          />
        </v-btn>
        <v-btn to="/music" text style="border-radius: 0px 4px 4px 0px">
          <v-img
            alt="Yandex Music"
            contain
            src="./media/yamusic_64x64.png"
            transition="scale-transition"
            width="32"
            style="top: -3px"
          />
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" persistent max-width="600px" scrollable>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" @click="getStoreValue" text>
            <v-icon large>mdi-settings</v-icon>
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
                <v-col cols="12">
                  <div class="label-box">
                    <label>Notification</label>
                  </div>
                  <v-checkbox
                    v-model="allowNotification"
                    label="Allow notification"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12">
                  <div class="label-box">
                    <label>Proxy</label>
                    <v-btn text right @click="clearProxy">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                  <v-row>
                    <v-col cols="3">
                      <v-select
                        v-model="protocol"
                        :items="itemsProtocol"
                        label="Protocol"
                      ></v-select>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        v-model="url"
                        label="0.0.0.0:0000"
                        single-line
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <div class="label-box">
                    <label>Key shortcut</label>
                  </div>
                  <v-col>
                    <v-row>
                      <v-checkbox
                        v-model="gsPlay"
                        label="Play | Pause"
                        style="padding-right: 10px"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="gsNextTrack"
                        label="Next track"
                        style="padding-right: 10px"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="gsPrevTrack"
                        label="Prev. track"
                        style="padding-right: 10px"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="gsMute"
                        label="Mute"
                        style="padding-right: 10px"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="gsExit"
                        label="Exit"
                        style="padding-right: 10px"
                      ></v-checkbox>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
            </v-container>
            <small>
              You can support me :)
              <v-btn @click="externalSupport" text>
                <v-icon medium>mdi-cash-usd</v-icon>
              </v-btn>
              <br />
              Copyright 2019-2021 ©
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

    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow-y: hidden !important;
}
.label-box {
  height: 41px;
  width: 50%;
  padding: 2px;
  border-color: #7e57c2;
  border-style: solid;
  border-width: 0 0 thin 0;
}
.label-box > label {
  font-size: 16px;
  font-weight: 600;
}
.label-box > button {
  position: sticky;
  left: 100%;
}
.v-messages {
  min-height: 0px im !important;
}
</style>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer, shell } from "electron";
import Home from "./components/Home.vue";
import store from "./electron/store";

export default Vue.extend({
  name: "App",

  components: {
    Home,
  },

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
  }),
  mounted() {
    //
  },
  methods: {
    externalSupport() {
      shell.openExternal("https://www.tinkoff.ru/sl/6XuoF9Bz5bk");
    },
    getStoreValue() {
      const settings = store.get("settings");

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
    save() {
      store.set("settings", {
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
