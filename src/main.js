import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { Cloudinary } from "@cloudinary/url-gen";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/aura-light-green/theme.css'

// PrimeVue components
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import PanelMenu from 'primevue/panelmenu'
import Card from 'primevue/card'
import Divider from 'primevue/divider'

// Custom styles
import './style.css'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'deep-purple': '#673AB7',
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(router)
app.use(vuetify)
app.use(PrimeVue, {
  ripple: true,
  inputStyle: "filled"
})

// Register PrimeVue components
app.component('Calendar', Calendar)
app.component('Dropdown', Dropdown)
app.component('Button', Button)
app.component('Tag', Tag)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('PanelMenu', PanelMenu)
app.component('Card', Card)
app.component('Divider', Divider)

// Mount app
app.mount('#app')