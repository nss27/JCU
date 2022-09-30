import { App } from "vue";

export default {
  install: (app: App<Element>) => {
    app.provide("rootIndex", 0);
  },
};
