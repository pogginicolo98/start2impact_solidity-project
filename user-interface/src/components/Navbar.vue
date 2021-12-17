<template>
  <div class="navbarComponent">
    <nav class="navbar navbar-light">
      <div class="container">
        <router-link class="navbar-brand"
                     :to="{ name: 'Home' }"
                     ><img alt="logo"
                           src="../assets/logo.png">
        </router-link>
        <button class="btn btn-primary btn-nav px-4"
                :class="{'disabled': !metamaskDetected}"
                @click="connectMetamask()"
                >{{ connectBtnText }}
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
  import detectEthereumProvider from '@metamask/detect-provider';
  import Web3 from "web3";

  export default {
    name: "NavbarComponent",
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
          // From now on, this should always be true:
          // provider === window.ethereum
          console.log('Ethereum successfully detected!');
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
          // this.userAccount = (await this.provider.request({ method: 'eth_accounts' }))[0];
        }
      },
    },
    created() {
      this.detectMetamask();
    }
  }
</script>

<style scoped>
  .navbar {
    border-bottom: 1px solid #C7B1A9 !important;
    background: transparent !important;
  }

  .btn-nav {
    border-radius: 1rem !important;
  }
</style>
