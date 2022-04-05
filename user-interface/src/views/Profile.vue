<template>
  <div class="profile">

    <!-- Content -->
    <div class="container-fluid height-100 my-4"
         v-show="!isLoading && walletConnected">
         <ProfileContentComponent />
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
  import ProfileContentComponent from "@/components/profile/ProfileContent.vue";
  import ConnectWalletComponent from "@/components/utility/ConnectWallet.vue";
  import SpinnerComponent from "@/components/utility/Spinner.vue";
  import walletConnectedMixin from "@/mixins/WalletConnected";

  export default {
    name: "Profile",

    computed: {
      isLoading() {
        return this.firstLoading;
      }
    },

    mixins: [
      walletConnectedMixin,
    ],

    components: {
      ProfileContentComponent,
      ConnectWalletComponent,
      SpinnerComponent,
    },
  };
</script>

<style scoped>
  .profile {
    height: 100%;
  }
</style>
