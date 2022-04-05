<template>
  <div class="nft-detail">

    <!-- Content -->
    <div class="container height-100 my-4"
         v-show="!isLoading && walletConnected">
         <NFTDetailContentComponent :propNft="nft" />
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
  import NFTDetailContentComponent from "@/components/nft-detail/NFTDetailContent.vue";
  import ConnectWalletComponent from "@/components/utility/ConnectWallet.vue";
  import SpinnerComponent from "@/components/utility/Spinner.vue";
  import walletConnectedMixin from "@/mixins/WalletConnected";

  export default {
    name: "NFTDetail",

    props: {
      tokenId: {
        type: String,
        required: true
      },
      metadata: {
        type: Object,
        required: false
      },
      price: {
        type: String,
        required: false
      },
      owner: {
        type: String,
        required: false
      },
    },

    data() {
      return {
        nft: {
          tokenId: this.tokenId,
          metadata: this.metadata != null ? this.metadata : null,
          price: this.price != null ? this.price : null,
          owner: this.owner != null ? this.owner : null,
        },
      }
    },

    computed: {
      isLoading() {
        return this.firstLoading;
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
