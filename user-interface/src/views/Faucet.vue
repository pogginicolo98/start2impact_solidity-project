<template>
  <div class="faucet">
    <div class="container height-100">
      <div class="row justify-content-center align-items-center height-100">
        <div class="col-5 box p-5">

          <!-- Title -->
          <div class="text-center">
            <h1 class="mb-3">WISP token faucet</h1>
            <h6 class="text-secondary">Get 1000 $WISP free, enter your address below and redeem!</h6>
          </div>

          <!-- Form -->
          <div class="mt-4">
            <FaucetFormComponent />
          </div>

        </div>
      </div>
      <!-- <div class="position-absolute top-50 start-50 translate-middle box" style="width: 38rem;">
        <div class="row justify-content-center"> -->

          <!-- Title -->
          <!-- <div class="col-11 text-center">
            <h1 class="mt-5 mb-3">Ropsten WISP faucet</h1>
            <h6>Receive 1000 $WISP for free, enter your address below and request them!</h6>
          </div> -->

          <!-- Form -->
          <!-- <div class="col-10 my-5">
            <FaucetFormComponent />
          </div> -->

        <!-- </div>
      </div> -->
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
  .faucet {
    height: 100%;
  }
</style>
