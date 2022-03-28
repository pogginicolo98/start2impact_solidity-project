import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'bootstrap';
import '@/assets/css/main.scss';
import Clipboard from "v-clipboard";
import Toasted from "vue-toasted";
import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip';
import AOS from 'aos'
import 'aos/dist/aos.css'
import connectWallet from "./plugins/connectWallet";
import connectIpfs from "./plugins/connectIpfs";

const Web3 = require("web3");
const web3Instance = new Web3();

if (window.ethereum) {
  web3Instance.currentProvider = window.ethereum;
}

Vue.use(connectWallet);
Vue.use(connectIpfs);
Vue.use(Toasted, {
  position: "bottom-right",
  duration: 8000,
  className: "vue-toast rounded fw-bold",
  iconPack: "fontawesome",
  singleton: true
});
Vue.use(Clipboard);
Vue.use(VueCustomTooltip, {
  name: 'VueCustomTooltip',
  color: '#fff',
  background: '#000',
  borderRadius: 12,
  fontWeight: 400,
})

Vue.prototype.$web3 = web3Instance;

Vue.config.productionTip = false;

Vue.mixin({
  created () {
    AOS.init()
  },
  computed: {
    web3() {
      if(this.$store.getters.getWeb3Instance) return this.$store.getters.getWeb3Instance
      console.log("here")
      return this.$web3
    }
  },
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
