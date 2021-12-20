import Vue from "vue";
import Vuex from "vuex";
import wallet from "@/store/modules/wallet";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    web3Instance: null
  },
  mutations: {
    setWeb3Instance(state, payload) {
      state.web3Instance = payload
    },
  },
  getters: {
    getStateIndex: (state) => state,
    getWeb3Instance: (state) => state.web3Instance,
  },
  modules: {
    wallet
  },
});
