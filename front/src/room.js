import { createApp } from 'vue'
import App from './room.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import '@icon-park/vue-next/styles/index.css';
const app = createApp(App)
app.mount('#app')