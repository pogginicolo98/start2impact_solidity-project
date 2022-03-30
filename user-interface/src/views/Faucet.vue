<template>
  <div class="faucet">
    <div class="container height-100">
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
