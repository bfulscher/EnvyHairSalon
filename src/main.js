// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
// import router from './router'
// import './firebase'  // This imports and runs the Firebase initialization
// import PrimeVue from 'primevue/config'

// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap'
// import 'bootstrap-icons/font/bootstrap-icons.css'


// // Styles


// import 'primevue/resources/themes/saga-blue/theme.css'
// import 'primevue/resources/primevue.min.css'
// import 'primeicons/primeicons.css'

// import Button from 'primevue/button'
// app.component('Button', Button)

// createApp(App).use(router).mount('#app').use(PrimeVue)

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './firebase'  // This imports and runs the Firebase initialization

// Styles
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

// Bootstrap JS
import 'bootstrap'

// PrimeVue
import PrimeVue from 'primevue/config'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)

app.use(PrimeVue)
app.component('Calendar', Calendar)
app.component('Dropdown', Dropdown)
app.component('Button', Button)
app.component('Tag', Tag)

app.mount('#app')