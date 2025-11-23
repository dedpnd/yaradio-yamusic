import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { mdiCog, mdiDelete, mdiCashMultiple, mdiRefresh } from "@mdi/js";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg",
    values: {
      settings: mdiCog,
      delete: mdiDelete,
      cash: mdiCashMultiple,
      refresh: mdiRefresh,
    },
  },
  theme: {
    themes: {
      light: {
        primary: "#ee44aa",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
