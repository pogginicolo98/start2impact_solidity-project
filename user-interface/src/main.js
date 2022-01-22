import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './app.scss'
import connectWallet from "./plugins/connectWallet";
import Toasted from "vue-toasted";

const Web3 = require("web3");
const web3Instance = new Web3();

if (window.ethereum) {
  web3Instance.currentProvider = window.ethereum;
}

Vue.use(connectWallet);
Vue.use(Toasted, {
  position: "bottom-right",
  duration: 8000,
  className: "vue-toast rounded fw-bold",
  iconPack: "fontawesome",
  singleton: true
});


Vue.prototype.$web3 = web3Instance;

Vue.config.productionTip = false;

Vue.mixin({
  computed: {
    web3() {
      if(this.$store.getters.getWeb3Instance) return this.$store.getters.getWeb3Instance
      console.log("here")
      return this.$web3
    }
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
