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

// PrimeVue core
import PrimeVue from 'primevue/config'

// PrimeVue components
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

// Styles
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
// Import your preferred PrimeVue theme (choose only one)
import 'primevue/resources/themes/aura-light-green/theme.css'  // or any other theme you prefer

// Bootstrap JS
import 'bootstrap'

const app = createApp(App)

// Configure PrimeVue first
app.use(PrimeVue, {
    ripple: true,
    inputStyle: "filled"
})

// Use router
app.use(router)

// Register PrimeVue components
app.component('Calendar', Calendar)
app.component('Dropdown', Dropdown)
app.component('Button', Button)
app.component('Tag', Tag)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)

app.mount('#app')