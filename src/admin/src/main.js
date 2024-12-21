import { createApp } from "vue";
import "./style.css";
import App from "./components/App.vue";
import router from "./router";
import authStore from "./stores/auth";
import "@infinity-frame/infinitycomponent/styles/main.scss";

const init = async () => {
  await authStore.refreshSession();

  const app = createApp(App);
  app.use(router);
  app.mount("#app");
};

init();
