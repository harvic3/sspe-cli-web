import Vue from "vue";
import Vuex from "vuex";
import { config } from "../config/config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      data: "",
      reconnectError: false,
      status: null,
    },
    wsUrl: (config.env === 'PROD') ? config.PROD_SERVICE : config.DEV_SERVICE,
    env: config.env,
    responseHistory: ""
  },
  mutations: {
    SOCKET_CONNECT(state, status) {
      state.socket.isConnected = true;
      state.socket.status = status;
    },
    SOCKET_DISCONNECT(state, status) {
      state.socket.isConnected = false;
      state.socket.status = status;
    },
    SOCKET_CHAT_MESSAGE(state, data) {
      state.socket.data = data.message || data;
      state.responseHistory = `${state.responseHistory}\r\n${
        state.socket.data
      }`;
    },
    ADD_HISTORY(state, data) {
      state.responseHistory = `${state.responseHistory}${data}`;
    },
    DELETE_HISTORY(state) {
      state.socket.data = "";
      state.responseHistory = "";
    }
  },
  actions: {
    saveHistoryData(context, data) {
      if (this.state.responseHistory !== "") {
        data = `\r\n${data}`;
      }
      context.commit("ADD_HISTORY", data);
    },
    deleteHistoryData(context) {
      context.commit("DELETE_HISTORY");
    }
  },
  getters: {
    getSocketData(state) {
      return state.socket.data;
    },
    getHistoryData(state) {
      return state.responseHistory;
    }
  }
});
