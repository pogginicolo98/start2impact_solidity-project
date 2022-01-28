import { create } from 'ipfs-http-client';
import store from "../../store";

/**
 * Check chached provider and try to connect.
 * If provider exist => store into vuex
 */
setTimeout(async () => {
  try {
    const ipfs = create('http://192.168.1.143:5001/');
    store.commit("SET_IPFS", ipfs);
  } catch (error) {
    console.log("Error in connect IPFS");
    console.log(error);
  }
});

export default {
  async install(Vue) {
    Vue.prototype.$connectWallet = async () => {
      console.log("install");
      try {
        const ipfs = create('http://192.168.1.143:5001/');
        store.commit("SET_IPFS", ipfs);
      } catch (error) {
        console.log("Error in connect IPFS");
        console.log(error);
      }
    };
  },
};
