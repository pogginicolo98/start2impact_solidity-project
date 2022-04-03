<template>
  <div class="faucet">
    <div class="container height-100" v-if="!firstLoading && walletConnected">
      <div class="row justify-content-center align-items-center height-100 mx-1">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6 col-xl-6 box p-4 p-sm-5">

          <!-- Title -->
          <div class="text-center">
            <h1 class="mb-3">Open your welcome chest</h1>
            <h6 class="text-secondary">Get 1000 $WISP free, enter your address below and redeem!</h6>
          </div>

          <!-- Form -->
          <div class="mt-4">
            <FaucetFormComponent />
          </div>

        </div>
      </div>
    </div>

    <div class="height-100" v-else-if="!firstLoading && !walletConnected">
      <ConnectWalletComponent />
    </div>

    <!-- Spinner -->
    <div class="d-flex justify-content-center align-items-center height-100"
         v-else>
         <div class="spinner-border text-secondary" style="width: 3rem; height: 3rem;" role="status">
           <span class="visually-hidden">Loading...</span>
         </div>
    </div>

  </div> <!-- Faucet -->
</template>

<script>
  import FaucetFormComponent from "@/components/FaucetForm.vue";
  import ConnectWalletComponent from "@/components/ConnectWallet.vue";
  import walletConnectedMixin from "@/mixins/WalletConnected";

  export default {
    name: "Faucet",

    data() {
      return {
        firstLoading: true,
      }
    },

    created() {
      setTimeout(() => {
        this.firstLoading = false;
      }, 300);
    },

    mixins: [
      walletConnectedMixin,
    ],

    components: {
      FaucetFormComponent,
      ConnectWalletComponent,
    },
  };
</script>

<style scoped>
  .faucet {
    height: 100%;
  }
</style>
