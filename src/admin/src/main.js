import { createApp } from "vue";

import App from "./components/App.vue";
import router from "./router";
import authStore from "./stores/auth";
import "@infinity-frame/infinitycomponent/styles/main.scss";
import "./style.css";

const init = async () => {
  await authStore.getSession();

  const app = createApp(App);
  app.use(router);
  app.mount("#app");
};

init();
