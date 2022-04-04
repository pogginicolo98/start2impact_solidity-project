<template>
  <div class="connect-wallet">
    <div class="d-flex justify-content-center align-items-center height-100">
         <div class="text-center">
           <i class="fa-solid fa-link-slash fs-70px mb-4"></i>
           <h2>Metamask not connected</h2>
           <h5 class="text-secondary">Please connect your wallet and make sure you selected the Ropsten network in order to load the page correctly</h5>
         </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ConnectWalletComponent",
  }
</script>

<style scoped>
  .connect-wallet {
      height: 100%;
    }
</style>
