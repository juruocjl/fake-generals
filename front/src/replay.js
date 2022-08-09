import { createApp } from 'vue'
import App from './Replay.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')