<template>
  <div class="faucet">
    <div class="container">
      <div class="position-absolute top-50 start-50 translate-middle box" style="width: 38rem;">
        <div class="row justify-content-center">

          <!-- Title -->
          <div class="col-11 text-center">
            <h1 class="mt-5 mb-3">Ropsten WISP faucet</h1>
            <h6>Receive 1000 $WISP for free, enter your address below and request them!</h6>
          </div>

          <!-- Form -->
          <div class="col-10 my-5">
            <FaucetFormComponent />
          </div>

        </div>
      </div>
    </div>
  </div> <!-- Faucet -->
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
