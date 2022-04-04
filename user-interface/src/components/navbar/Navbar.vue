<template>
  <div class="navbar-component">
    <nav class="navbar navbar-dark navbar-expand-lg">
      <div class="container">

        <router-link class="navbar-brand me-auto"
                     :to="{ name: 'Home' }"
                     ><img alt="logo"
                           src="../../assets/images/logo.png">
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">

          <div class="mx-auto my-4 my-lg-0"
               v-show="metamaskConnected">
               <hr class="d-block d-lg-none">
               <div class="navbar-nav pe-4">
                 <router-link class="nav-link me-lg-3"
                              :to="{ name: 'Marketplace' }"
                              ><i class="fa-solid fa-scale-balanced me-2"></i>Merchant
                 </router-link>
                 <router-link class="nav-link me-lg-3"
                              :to="{ name: 'Profile' }"
                              ><i class="fa-solid fa-dungeon me-2"></i>Den
                 </router-link>
                 <router-link class="nav-link"
                              :to="{ name: 'Faucet' }"
                              ><i class="fa-solid fa-gift me-2"></i>Welcome chest
                 </router-link>
               </div>
               <hr class="d-block d-lg-none">
          </div>
          <button class="btn btn-primary ms-auto mt-3 mb-4 my-lg-0"
                  v-if="!metamaskConnected"
                  @click="handleConnect"
                  >Connect Metamask
          </button>
          <VueCustomTooltip position="is-left"
                            v-else
                            :label="tokenIdLabel">
                            <button class="btn btn-primary ms-auto mt-3 mb-4 my-lg-0"
                                    style="width: 156px;"
                                    @click="handleConnect"
                                    >{{ getAddress }}
                            </button>
          </VueCustomTooltip>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "NavbarComponent",

    data() {
      return {
        tokenIdLabel: "Copy",
      }
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet"
      }),

      getAddress() {
        const address =
          this.wallet && this.wallet.address
            ? this.wallet.address.toString()
            : "";
        if (address && address.length === 42) {
          const str1 = String(address).slice(0, 6);
          const str2 = String(address).slice(address.length - 4, address.length);
          return `${str1}...${str2}`;
        }
        return "Error";
      },

      metamaskConnected() {
        return this.wallet && this.wallet.address;
      },
    },

    methods: {
      copyToClipboard(payload) {
        this.$clipboard(payload);
        if (this.tokenIdLabel === "Copy") {
          this.tokenIdLabel = "Copied!";
          setTimeout(() => {
            this.tokenIdLabel = "Copy";
          }, 5000);
        }
      },

      handleConnect() {
        if (this.wallet && this.wallet.address) {
          this.copyToClipboard(this.wallet.address);
        } else {
          this.$connectWallet();
        }
      },
    },
  }
</script>

<style scoped>
  .navbar {
    border-bottom: 1px solid hsla(0,0%,100%,.2) !important;
    background: #252423 !important;
  }

  .nav-link {
    font-size: 18px !important;
    color: #adb5bd !important;
  }

  .nav-link:hover {
    color: #FFF !important;
  }

  .router-link-active {
    color: #FFF !important;
  }
</style>
