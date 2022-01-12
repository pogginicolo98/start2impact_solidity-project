<template>
  <div class="faucet">
    <div class="container text-center">
      <div class="position-absolute top-50 start-50 translate-middle box">
        <!-- Title -->
        <h1 class="mt-5 mb-3">Ropsten WISP token faucet</h1>
        <h5 class="mb-5">Receive 1000 WISP per request</h5>

        <!-- Form -->
        <FaucetFormComponent class="mb-5"/>
      </div>



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
  .box {
    width: 38rem;
    border-radius: 12px;
    background-color: #2c2c2c;
  }
</style>
