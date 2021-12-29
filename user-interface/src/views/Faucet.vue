<template>
  <div class="faucet">
    <div class="container text-center mt-5">
      <!-- Title -->
      <h1 class="mb-3">Ropsten WISP token faucet</h1>
      <h5>Receive 1000 WISP per request</h5>

      <!-- Form -->
      <FaucetFormComponent />
    </div>
  </div>
</template>

<script>
  import FaucetFormComponent from "@/components/FaucetForm.vue";

  export default {
    name: "Faucet",

    components: {
      FaucetFormComponent,
    },
  };
</script>

<style scoped>
</style>
