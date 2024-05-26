<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { io } from 'socket.io-client'

const store = useStore()

const socket = io(store.state.wsUrl, {
  transports: ['polling', 'websocket'],
  path: '/stomp',
  withCredentials: true,
  autoConnect: false
})

const screenData = ref(null);
const command = ref(null)
const lastResponse = ref('')
const commandHistory = ref([])
const cursor = ref(0)
const lastCommand = ref(null)
const countCommands = ref(0)
const screenText = ref(null)
const lastTextHeight = ref(null)

onMounted(() => {
  connectClient()
  screenText.value = screenData.value.value
  lastTextHeight.value = screenText.value.scrollHeight
})

socket.on('connect', () => {
  console.log('Client connected')
  createListener()
  store.commit('SOCKET_CONNECT', 'connected')
})

socket.on('disconnect', () => {
  console.log('Client disconnected')
  store.commit('SOCKET_DISCONNECT', 'disconnected')
})

// const setTextHeightArea = (textHeight) => {
//   lastTextHeight.value = textHeight
// }

const connectClient = () => {
  if (!socket.connected) {
    command.value = 'connecting...'
    setTimeout(() => {
      socket.connect()
      command.value = null
    }, 2000)
  }
}

const disconnectClient = () => {
  if (socket.connected) {
    socket.disconnect()
    console.log('disconnect action')
  }
}

const createListener = () => {
  socket.on('chat_message', (data) => {
    console.log('SCREEN TEXT VALUE: ', screenText.value)
    store.commit('SOCKET_CHAT_MESSAGE', data)
  })
}

const rememberCommand = (e) => {
  if (cursor.value === 0 && commandHistory.value.length === 1) {
    command.value = commandHistory.value[0]
    return
  }
  if (e.keyCode === 38) {
    if (cursor.value > 0) {
      cursor.value--
    }
    command.value = commandHistory.value[cursor.value]
  } else if (e.keyCode === 40 && commandHistory.value.length > 0) {
    if (cursor.value < commandHistory.value.length - 1) {
      cursor.value++
    }
    command.value = commandHistory.value[cursor.value]
  }
}

const sendBySocket = (cmd) => {
  let options = cmd.replace('  ', ' ').split(' ')
  socket.emit('chat_message', options)
  store.dispatch('saveHistoryData', `\r\n${cmd}`)
  lastCommand.value = cmd
  command.value = null
  countCommands.value += countCommands.value
  calculateTextHeight()
}

const sendCommand = (e) => {
  if (e.keyCode === 13) {
    if (store.state.socket.isConnected) {
      screenText.value = screenData.value.value
      if (command.value === 'clear') {
        store.dispatch('deleteHistoryData')
        command.value = null
        store.dispatch('saveHistoryData', '')
        screenText.value.value = ''
        return
      }
      commandHistory.value.push(command.value)
      if (!proceed(command.value)) {
        return
      }
      sendBySocket(command.value)
    } else {
      alert('Not connected')
    }
  }
}

const getSocketData = () => {
  lastResponse.value = store.getters.getSocketData
}

const proceed = (cmd) => {
  if (lastCommand.value && lastCommand.value === 'sspe list') {
    const pattern = new RegExp(`(?<=${command.value}:\\s)(.*?).*`, 'g')
    command.value = `sspe select --path ${lastResponse.value.match(pattern)}`
    if (command.value.includes('CANCEL')) {
      store.dispatch('saveHistoryData', `\r\nThe action was canceled!`)
      command.value = ''
      lastCommand.value = ''
      return false
    } else if (cmd.includes('sspe ml --iter')) {
      store.dispatch('saveHistoryData', `\r\nDo you want to run the network training? y/n`)
      return true
    }
    return true
  } else if (lastCommand.value && lastCommand.value.includes('sspe ml --iter')) {
    if (cmd.toLowerCase() === 'y') {
      command.value = lastCommand.value
    } else {
      store.dispatch('saveHistoryData', `\r\nOkay, don't panic, nothing's gonna happen.`)
    }
  }
  return true
}

const calculateTextHeight = () => {
  // console.log("Scroll top b: ", screenText.value.scrollTop, " - ", screenText.value.scrollHeight);
  // screenText.value.scrollTop = screenText.value.scrollHeight + screenText.value.offsetHeight;
  // console.log("Scroll top a: ", screenText.value.scrollTop, " - ", screenText.value.scrollHeight);
  // lastTextHeight.value = screenText.value.scrollHeight;
}

const getHistoryData = computed(() => {
  getSocketData()
  return store.getters.getHistoryData
})
</script>

<template>
  <div id="terminal" ref="terminal">
    <div class="terminal-window">
      <div class="terminal-bar">
        <div class="text-left">
          <span>Console</span>
          <span v-if="store.state.socket.isConnected">✅</span>
          <span v-if="!store.state.socket.isConnected">❌</span>
        </div>
      </div>
      <div class="terminal-body">
        <input
          class="command text-input"
          @keyup.enter="sendCommand"
          @keyup.up="rememberCommand"
          @keyup.down="rememberCommand"
          v-model="command"
          autofocus="true"
          type="text"
        />
        <textarea
          id="screenData"
          ref="screenData"
          disabled="true"
          class="console text-input"
          readonly="true"
          wrap="hard"
          v-model="getHistoryData"
        />
        <div>
          <button
            class="connect pulse"
            @click="connectClient"
            :disabled="store.state.socket.isConnected"
          >
            Connect
          </button>
          <button
            class="disconnect pulse"
            @click="disconnectClient"
            :disabled="!store.state.socket.isConnected"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#terminal {
  min-height: 55vh;
  max-width: 60%;
  margin: 0 auto;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 5px;
  background: #1d1f21;
  box-shadow: 0px 13px 17px -6px rgba(0, 0, 0, 0.38);
  margin-bottom: 50px;
}
#terminal:hover {
  transform: translate3d(0, -10px, 0);
  box-shadow: 0px 38px 90px -38px rgba(0, 0, 0, 0.45);
}
.terminal-window {
  border-radius: 5px;
  color: #111;
}
.terminal-bar {
  background: rgba(225, 225, 225, 0.75);
  height: 35px;
  line-height: 36px;
  padding-left: 4px;
  padding-top: 1px;
}
.terminal-body {
  text-align: center;
  padding: 8px 8px 0 8px;
  color: #eee;
  line-height: 25px;
  font-family: monospace, Quicksand, sans-serif;
  display: grid;
}
.command {
  color: rgb(14, 216, 31);
  background-color: #1d1f21;
  height: 30px;
  font-size: 18px;
}
.console {
  color: #fff;
  background-color: #1d1f21;
  height: 45vh;
  margin-top: 5px;
  resize: none;
}
.text-input {
  border-width: 0;
  display: block;
  margin-bottom: 5px;
}
button {
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
  margin: 0.5em;
  padding: 1em 1em;
  width: 115px;
}
.connect {
  color: #8fc866;
}
.disconnect {
  color: #ff7f82;
}
button:hover,
button:focus {
  border-color: var(--hover);
  color: #fff;
}
.pulse:hover,
.pulse:focus {
  animation: pulse 1s;
  box-shadow: 0 0 0 2em rgba(#fff, 0);
}
</style>
