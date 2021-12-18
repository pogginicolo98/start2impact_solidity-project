<template>
  <div id="app">
    <NavbarComponent :metamaskDetected="metamaskDetected"
                     :metamaskConnected="metamaskConnected"
                     :connectBtnText="connectBtnText"
                     @connect-metamask="connectMetamask()" />
    <router-view />
    <FooterComponent />
  </div>
</template>

<script>
  // @ is an alias to /src
  import NavbarComponent from "@/components/Navbar.vue";
  import FooterComponent from "@/components/Footer.vue";
  import detectEthereumProvider from '@metamask/detect-provider';
  import Web3 from "web3";

  export default {
    name: "App",
    components: {
      NavbarComponent,
      FooterComponent,
    },
    data() {
      return {
        provider: null,
        web3: null,
        userAccount: null,
      }
    },
    computed: {
      metamaskDetected() {
        return this.provider !== null;
      },
      metamaskConnected() {
        return this.userAccount !== null;
      },
      connectBtnText() {
        const address =
          this.provider && this.userAccount
            ? this.userAccount.toString()
            : "";
        if (address && address.length === 42) {
          const str1 = String(address).slice(0, 6);
          const str2 = String(address).slice(address.length - 4, address.length);
          return `${str1}...${str2}`;
        } else {
          return "Connect";
        }
      },
    },
    methods: {
      async detectMetamask() {
        this.provider = await detectEthereumProvider();

        if (this.provider) {
          this.connectMetamask();
        } else {
          console.log('Please install MetaMask!');
        }
      },
      async connectMetamask() {
        if (this.provider !== null) {
          const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
          this.userAccount = accounts[0];
          this.web3 = new Web3(this.provider);
        }
      },
    },
    created() {
      this.detectMetamask();
    }
  }
</script>

<style>
  html, body {
    height: 100%;
  }
</style>
