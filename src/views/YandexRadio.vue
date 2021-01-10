<template>
  <div style="height: 100%">
    <webview
      src="https://radio.yandex.ru/"
      style="height: 100%"
      allowpopups
      plugins
      partition="persist:webviewsession"
    ></webview>
    <v-progress-circular
      :size="70"
      :width="7"
      color="purple"
      class="sppiner"
      indeterminate
      v-if="show"
    ></v-progress-circular>
  </div>
</template>

<style>
.sppiner {
  z-index: 1;
  top: 40%;
  left: 50%;
  position: absolute;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  data: () => ({
    show: true
  }),
  async mounted() {
    document.title = "YaRadio";
    const webview: any = document.querySelector("webview");

    const loadstop = () => {
      this.show = false;
    };

    if (webview) {
      webview.addEventListener("did-stop-loading", loadstop);
    }

    webview.addEventListener("dom-ready", async () => {
      await webview.insertCSS(`
        div.page-root {
          overflow: hidden;
          overflow-x: hidden;
          overflow-y: hidden;
        }
        div.footer__right div {
          display: none;
        }
      `);
    });
  }
});
</script>
