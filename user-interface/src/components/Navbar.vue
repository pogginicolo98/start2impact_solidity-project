<template>
  <div class="navbarComponent">
    <nav class="navbar navbar-light navbar-expand">
      <div class="container">
        <router-link class="navbar-brand me-auto"
                     :to="{ name: 'Home' }"
                     ><img alt="logo"
                           src="../assets/logo.png">
        </router-link>
        <div class="mx-auto"
             v-show="metamaskConnected">
             <div class="navbar-nav pe-4">
               <router-link class="nav-link"
                            :to="{ name: 'Marketplace' }"
                            >Marketplace
               </router-link>
               <router-link class="nav-link"
                            :to="{ name: 'Mint' }"
                            >Create
               </router-link>
               <router-link class="nav-link"
                            :to="{ name: 'Faucet' }"
                            >Faucet
               </router-link>
             </div>
        </div>
        <button class="btn btn-primary btn-nav px-4 ms-auto"
                @click="handleConnect"
                >{{ connectBtnText }}
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "NavbarComponent",
    computed: {
      ...mapGetters({
        wallet: "getWallet"
      }),
      connectBtnText() {
        const address =
          this.wallet && this.wallet.address
            ? this.wallet.address.toString()
            : "";
        if (address && address.length === 42) {
          const str1 = String(address).slice(0, 6);
          const str2 = String(address).slice(address.length - 4, address.length);
          return `${str1}...${str2}`;
        }
        return "Connect Metamask";
      },
      metamaskConnected() {
        return this.wallet && this.wallet.address;
      }
    },
    methods: {
      handleConnect() {
        this.$connectWallet();
      },
    },
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
