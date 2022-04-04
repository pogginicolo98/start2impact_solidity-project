<template>
  <div class="nft-detail">
    
    <!-- Content -->
    <div class="container height-100 mt-4"
         v-show="!isLoading && walletConnected">
         <MarketplaceContentComponent @loadingEnded="nftLoaded" />
    </div>

    <!-- Wallet not connected -->
    <div class="height-100"
         v-if="!isLoading && !walletConnected">
         <ConnectWalletComponent />
    </div>

    <!-- Loading -->
    <div class="height-100"
         v-else>
         <SpinnerComponent />
    </div>

  </div>
</template>

<script>
  import NFTDetailContentComponent from "@/components/marketplace/NFTDetailContent.vue";
  import ConnectWalletComponent from "@/components/utility/ConnectWallet.vue";
  import SpinnerComponent from "@/components/utility/Spinner.vue";
  import walletConnectedMixin from "@/mixins/WalletConnected";

  export default {
    name: "NFTDetail",

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
      nftsLoaded() {
        this.loadingNfts = false;
      },
    },

    mixins: [
      walletConnectedMixin,
    ],

    components: {
      NFTDetailContentComponent,
      ConnectWalletComponent,
      SpinnerComponent,
    },
  };
</script>

<style scoped>
  .nft-detail {
    height: 100%;
  }
</style>
