import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'

import App from './App.vue'
import store from './store/store.js'
import router from './router'

const appStore = createStore({
    state () {
       return {
         count: 0
       }
    },
    mutations: {
       increment (state) {
         state.count++
       }
    }
   })

const app = createApp(App)

app.use(store)
    .use(router)
        .mount('#app');