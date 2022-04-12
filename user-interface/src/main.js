// Vue instance
import Vue from "vue";
import App from "./App.vue";

// Plugins
import router from "./router";
import store from "./store";
import connectWallet from "./plugins/connectWallet";
import connectIpfs from "./plugins/connectIpfs";
import Clipboard from "v-clipboard";
import Toasted from "vue-toasted";
import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip';

// Style
import 'bootstrap';
import '@/assets/css/main.scss';
import AOS from 'aos'
import 'aos/dist/aos.css'

// Init web3
const Web3 = require("web3");
const web3Instance = new Web3();
if (window.ethereum) {
  web3Instance.currentProvider = window.ethereum;
}
Vue.prototype.$web3 = web3Instance;

// Init IPFS
let ipfsServer = window.location.hostname;
store.commit("SET_SERVER", ipfsServer);

// Plugins
Vue.use(connectWallet);
Vue.use(connectIpfs);
Vue.use(Clipboard);
Vue.use(Toasted, {
  position: "bottom-right",
  duration: 8000,
  className: "vue-toast rounded fw-bold",
  iconPack: "fontawesome",
  singleton: true
});
Vue.use(VueCustomTooltip, {
  name: 'VueCustomTooltip',
  color: '#fff',
  background: '#000',
  borderRadius: 12,
  fontWeight: 400,
})

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
  methods: {
    logError(message, error) {
      console.log(message);
      console.log(error);
      this.$toasted.show(message, {icon: "skull-crossbones"});
    },
  },
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
