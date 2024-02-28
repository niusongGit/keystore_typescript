import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Buffer} from 'buffer';
// 如果 window 上不存在 Buffer，则将其设置为全局的 Buffer
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
    window.Buffer = Buffer;
}
createApp(App).use(store).use(router).mount('#app')
