<template>
  <div class="navbarComponent">
    <nav class="navbar navbar-light navbar-expand-lg">
      <div class="container">

        <!-- Brand -->
        <router-link class="navbar-brand me-auto"
                     :to="{ name: 'Home' }"
                     ><img alt="logo"
                           src="../assets/images/logo.png">
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="mx-auto"
               v-show="metamaskConnected">
               <div class="navbar-nav pe-4">
                 <router-link class="nav-link text-secondary"
                              :to="{ name: 'Marketplace' }"
                              >Marketplace
                 </router-link>
                 <router-link class="nav-link text-secondary"
                              :to="{ name: 'Profile' }"
                              >Profile
                 </router-link>
                 <router-link class="nav-link text-secondary"
                              :to="{ name: 'Faucet' }"
                              >Faucet
                 </router-link>
               </div>
          </div>
          <button class="btn btn-primary px-4 ms-auto"
                  @click="handleConnect"
                  >{{ connectBtnText }}
          </button>
        </div>
      </div>
    </nav>

    <!-- <nav class="navbar navbar-light navbar-expand">
      <div class="container">

        <router-link class="navbar-brand me-auto"
                     :to="{ name: 'Home' }"
                     ><img alt="logo"
                           src="../assets/images/logo.png">
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" style="width: 100%" id="navbarNav">
          <div class="mx-auto"
               v-show="metamaskConnected">
               <div class="navbar-nav pe-4">
                 <router-link class="nav-link text-secondary"
                              :to="{ name: 'Marketplace' }"
                              >Marketplace
                 </router-link>
                 <router-link class="nav-link text-secondary"
                              :to="{ name: 'Profile' }"
                              >Profile
                 </router-link>
                 <router-link class="nav-link text-secondary"
                              :to="{ name: 'Faucet' }"
                              >Faucet
                 </router-link>
               </div>
          </div>
          <button class="btn btn-primary px-4 ms-auto"
                  @click="handleConnect"
                  >{{ connectBtnText }}
          </button>
        </div>


      </div>
    </nav> -->
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
      },
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
    border-bottom: 1px solid hsla(0,0%,100%,.2) !important;
    background: transparent !important;
  }
</style>
