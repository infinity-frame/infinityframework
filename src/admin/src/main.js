import { createApp } from "vue";
import "./style.css";
import App from "./components/App.vue";
import router from "./router";
import "@infinity-frame/infinitycomponent/styles/main.scss";

createApp(App).use(router).mount("#app");
