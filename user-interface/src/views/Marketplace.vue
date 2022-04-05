<template>
  <div class="marketplace">

    <!-- Content -->
    <div class="container height-100 my-4"
         v-show="!isLoading && walletConnected">
         <MarketplaceContentComponent @loadingStatus="setLoading($event)" />
    </div>

    <!-- Wallet not connected -->
    <div class="height-100"
         v-if="!isLoading && !walletConnected">
         <ConnectWalletComponent />
    </div>

    <!-- Loading -->
    <div class="height-100"
         v-else-if="isLoading">
         <SpinnerComponent />
    </div>

  </div>
</template>

<script>
  import MarketplaceContentComponent from "@/components/marketplace/MarketplaceContent.vue";
  import ConnectWalletComponent from "@/components/utility/ConnectWallet.vue";
  import SpinnerComponent from "@/components/utility/Spinner.vue";
  import walletConnectedMixin from "@/mixins/WalletConnected";

  export default {
    name: "Marketplace",

    data() {
      return {
        loadingNfts: true,
      }
    },

    computed: {
      isLoading() {
        return this.firstLoading || this.loadingNfts;
      },
    },

    methods: {
      setLoading(payload) {
        this.loadingNfts = payload;
      },
    },

    mixins: [
      walletConnectedMixin,
    ],

    components: {
      MarketplaceContentComponent,
      ConnectWalletComponent,
      SpinnerComponent,
    },
  };
</script>

<style scoped>
  .marketplace {
    height: 100%;
  }
</style>
