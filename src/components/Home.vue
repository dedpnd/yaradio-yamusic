<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";

import store from "../electron/store";

export default defineComponent({
  name: "Home",
  data: () => ({
    //
  }),
  async mounted() {
    async function exec(command: string) {
      const webview: any = document.querySelector("webview");

      if (webview) {
        await webview.executeJavaScript(`externalAPI.${command};`);
      }
    }

    async function getTrackInfo() {
      const webview: any = document.querySelector("webview");
      if (webview) {
        const a = await webview.executeJavaScript(`
          function foo(){
            return externalAPI.getCurrentTrack()
          };
          foo();
        `);
        ipcRenderer.sendSync("setTrackInfo", a);
      }
    }

    ipcRenderer.on("play", async () => await exec("togglePause()"));
    ipcRenderer.on("next", async () => await exec("next()"));
    ipcRenderer.on("prev", async () => await exec("prev()"));
    ipcRenderer.on("like", async () => await exec("toggleLike()"));
    ipcRenderer.on("dislike", async () => await exec("toggleDislike()"));
    ipcRenderer.on("mute", async () => await exec("toggleMute()"));
    ipcRenderer.on("getTrackInfo", async () => {
      await getTrackInfo();
    });

    // Load app
    const lastApp = store.get("lastApp");

    if (lastApp == "YaRadio") {
      if (this.$route.path !== "/radio")
        this.$router.push({ name: "YaRadio" }).catch(() => {
          /**/
        });
    } else {
      if (this.$route.path !== "/music")
        this.$router.push({ name: "YaMusic" }).catch(() => {
          /**/
        });
    }
  },
});
</script>
