import Vue from "vue";
import Vuex from "vuex";
import wallet from "@/store/modules/wallet";
import ipfs from "@/store/modules/ipfs";
import mintForm from "@/store/modules/mintForm";

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
    wallet,
    ipfs,
    mintForm,
  },
});
