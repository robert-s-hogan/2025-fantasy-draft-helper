import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

// <-- import Tailwind!
import "@styles/tailwind.css";

createApp(App).use(createPinia()).mount("#app");
