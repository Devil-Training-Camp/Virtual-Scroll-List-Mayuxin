import { createApp } from 'vue'
import { VirtualScrollList } from '@devil-training-camp/yuxin-ui'
import '@devil-training-camp/yuxin-ui/ui/es/style.css'
import App from './App.vue'

createApp(App).use(VirtualScrollList).mount('#app')
