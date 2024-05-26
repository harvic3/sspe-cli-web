<script setup>
import TheHeader from './components/TheHeader.vue'
import InterfaceCLI from './components/InterfaceCLI.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <div id="app" v-bind:class="{ disconnected: !$store.state.socket.isConnected }">
    <TheHeader />
    <InterfaceCLI />
    <TheFooter />
  </div>
</template>

<style>
@media only screen and (max-width: 768px) {
  h1 {
    font-size: 40px !important;
  }
  #terminal {
    max-width: 90% !important;
  }
  .command {
    height: 26px !important;
    font-size: 13px !important;
  }
  button {
    padding: 0.5em 0.5em !important;
  }
}

body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0 auto;
  padding: 0;
  color: #fff;
  background: #162c41db;
  display: block;
  height: 100vh;
  width: 100vw;
}
.disconnected {
  color: #ce5050 !important;
  background: #505050 !important;
}
.disconnected:body {
  content: 'Disconnected';
  font-size: 10em;
  color: rgba(214, 52, 52, 0.4);
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
