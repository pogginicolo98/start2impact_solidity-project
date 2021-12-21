import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './app.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRocket } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import connectWallet from "./plugins/connectWallet";

const Web3 = require("web3");
const web3Instance = new Web3();

if (window.ethereum) {
  web3Instance.currentProvider = window.ethereum;
}

Vue.use(connectWallet);

library.add(faRocket,faGithub, faLinkedinIn);
Vue.component('font-awesome-icon', FontAwesomeIcon);

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
