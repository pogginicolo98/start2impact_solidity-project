import { create } from 'ipfs-http-client';
import store from "../../store";

/**
 * Check chached provider and try to connect.
 * If provider exist => store into vuex
 */
setTimeout(async () => {
  try {
    const ipfs = create('http://13.38.213.148:5001/');
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
        const ipfs = create('http://13.38.213.148:5001/');
        store.commit("SET_IPFS", ipfs);
      } catch (error) {
        console.log("Error connecting to IPFS node");
        console.log(error);
      }
    };
  },
};
