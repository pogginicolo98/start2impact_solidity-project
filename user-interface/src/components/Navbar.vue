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
             <div class="navbar-nav">
               <router-link class="nav-link"
                            :to="{ name: 'Marketplace' }"
                            >Marketplace
               </router-link>
               <router-link class="nav-link"
                            :to="{ name: 'Mint' }"
                            >Mint
               </router-link>
               <router-link class="nav-link"
                            :to="{ name: 'Faucet' }"
                            >Faucet
               </router-link>
             </div>
        </div>
        <button class="btn btn-primary btn-nav px-4 ms-auto"
                :class="{'disabled': !metamaskDetected}"
                @click="connectMetamaskHandler()"
                >{{ connectBtnText }}
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    name: "NavbarComponent",
    props: {
      metamaskDetected: {
        type: Boolean,
        required: true
      },
      metamaskConnected: {
        type: Boolean,
        required: true
      },
      connectBtnText: {
        type: String,
        required: true
      }
    },
    methods: {
      connectMetamaskHandler() {
        this.$emit("connect-metamask");
      }
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
