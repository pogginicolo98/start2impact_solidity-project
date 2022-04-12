import { create } from 'ipfs-http-client';
import store from "../../store";

/**
 * Check chached provider and try to connect.
 * If provider exist => store into vuex
 */
setTimeout(async () => {
  try {
    const server = store.getters.getServer;
    const ipfs = create(`http://${server}/`);
    store.commit("SET_IPFS", ipfs);
  } catch (error) {
    console.log("Error connecting to IPFS node");
    console.log(error);
  }
});

export default {
  async install(Vue) {
    Vue.prototype.$connectIPFS = async () => {
      console.log("Connect IPFS");
      try {
        const server = store.getters.getServer;
        const ipfs = create(`http://${server}/`);
        store.commit("SET_IPFS", ipfs);
      } catch (error) {
        console.log("Error connecting to IPFS node");
        console.log(error);
      }
    };
  },
};
