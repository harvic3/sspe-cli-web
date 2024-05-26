import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { io } from 'socket.io-client'
import VueSocketIO from 'vue-3-socket.io'

const app = createApp(App)

const socketInstance = io(store.state.wsUrl, {
  transports: ['polling', 'websocket'],
  path: '/stomp',
  withCredentials: true,
  autoConnect: false
})

app.use(
  new VueSocketIO({
    debug: true,
    connection: socketInstance,
  })
)

if (store.state.env === 'dev') {
  app.config.devtools = true
} else {
  app.config.devtools = false
}

app.use(store).mount('#app')
