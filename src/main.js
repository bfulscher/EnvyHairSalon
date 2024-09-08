import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import './firebase'  // This imports and runs the Firebase initialization

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).use(router).mount('#app')