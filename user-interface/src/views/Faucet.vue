<template>
  <div class="faucet">

    <!-- Content -->
    <div class="container height-100"
         v-if="!isLoading && walletConnected">
         <FaucetContentComponent />
    </div>

    <!-- Wallet not connected -->
    <div class="height-100"
         v-else-if="!isLoading && !walletConnected">
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
  import FaucetContentComponent from "@/components/faucet/FaucetContent.vue";
  import ConnectWalletComponent from "@/components/utility/ConnectWallet.vue";
  import SpinnerComponent from "@/components/utility/Spinner.vue";
  import walletConnectedMixin from "@/mixins/WalletConnected";

  export default {
    name: "Faucet",

    computed: {
      isLoading() {
        return this.firstLoading;
      }
    },

    mixins: [
      walletConnectedMixin,
    ],

    components: {
      FaucetContentComponent,
      ConnectWalletComponent,
      SpinnerComponent,
    },
  };
</script>

<style scoped>
  .faucet {
    height: 100%;
  }
</style>
