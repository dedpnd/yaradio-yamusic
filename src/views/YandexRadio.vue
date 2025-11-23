// webpreferences="nativeWindowOpen=yes"

<template>
  <div style="height: 100%">
    <webview
      src="https://music.yandex.ru/radio"
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
import Store from "../store";

export default Vue.extend({
  name: "Home",
  data: () => ({
    show: true
  }),
  async mounted() {
    document.title = "YaRadio";
    const webview: any = document.querySelector("webview");

    Store.commit("loadingSetTrue");

    const loadstop = () => {
      this.show = false;
      Store.commit("loadingSetFalse");
    };

    if (webview) {
      webview.addEventListener("did-stop-loading", loadstop);
      webview.addEventListener("dom-ready", async () => {
        try {
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

            /* Sidebar */
            div.sidebar__under, #brandingFrame {
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
            
            /* Custom */
            /* CSS class for div.centerblock-wrapper */
            .centerblock-wrapper__no_margin {
              margin-right: 0px !important;
            }
          `);

          // Hide sidebar once DOM is available
          await webview.executeJavaScript(`
          function hideSidebar(){
            const centralBlockDOM = document.querySelector('div.centerblock-wrapper');
            const sidebarDOM = document.querySelector('.sidebar');
            
            if (!centralBlockDOM || !sidebarDOM) {
              setTimeout(hideSidebar, 500);
              return;
            }

            centralBlockDOM.style.marginRight = '0px';

            const observer = new MutationObserver(function(mutations) {    
              const trackSidebarDOM = document.querySelector('.sidebar-cont.sidebar-cont_shown.deco-pane'); 
                
              if (trackSidebarDOM) {
                  centralBlockDOM.style.marginRight = '';
                  observer.disconnect();
              } else {
                  centralBlockDOM.style.marginRight = '0px';
              }

              setTimeout(startObserving,1000);
            });

            const startObserving = function() {
                observer.observe(sidebarDOM, { 
                    childList: true,
                    subtree: true
                });
            }

            startObserving();
          }
          
          function innerRoute(location){
            let tmpDom = document.createElement('a');
            tmpDom.id = 'innerRoute'
            tmpDom.setAttribute('href', location);
            
            document.body.appendChild(tmpDom);       
            document.querySelector('#innerRoute').click();
          }

          // Init
          hideSidebar();
          `);
        } catch (err) {
          console.error("webview dom-ready handler failed", err);
        }

        // did-stop-loading may not work
        loadstop();
      });
    }
  }
});
</script>
