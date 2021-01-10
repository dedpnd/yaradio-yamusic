<template>
  <div style="height: 100%">
    <webview
      src="https://music.yandex.ru/home"
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
    document.title = "YaMusic";
    const webview: any = document.querySelector("webview");

    const loadstop = () => {
      this.show = false;
    };

    if (webview) {
      webview.addEventListener("did-stop-loading", loadstop);
    }

    webview.addEventListener("dom-ready", async () => {
      // did-stop-loading may not work
      loadstop();
      await webview.insertCSS(`              
        /* Overhead */
        .d-overhead {
          display: none !important;
        }

        /* Header */
        .adfox-creative {
          display: none !important;
        }

        /* Popup */
        .popup.popup_page.deco-pane {
          height: 100%;
        }

        .popup-sequence__content {
          margin-bottom: 65px;
        }

        div.centerblock-wrapper {
          margin-right: 0px !important;
        }

        /* Sidebar */
        div.sidebar__placeholder {
          display: none !important;
        }

        div.bar-below__auth,
        .bar-below,
        .bar-below_plus {
          display: none !important;
        }

        /* Footer */
        div.footer-app-install {
          display: none !important;
        }

        .centerblock-wrapper.deco-pane .footer {
          display: none !important;
        }
      `);
    });
  }
});
</script>
