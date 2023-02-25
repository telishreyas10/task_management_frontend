import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

const vuetify = createVuetify({
    components,
    directives,
  })

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');
