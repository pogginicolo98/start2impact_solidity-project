<template>
  <div class="mint">
    <div class="container mt-5">
      <!-- Title -->
      <div class="text-center">
        <h1 class="mb-3">Create</h1>
        <h5>Mint a new Treasure Chest NFT</h5>
      </div>

      <!-- Form -->
      <MintFormComponent />
    </div>
  </div>
</template>

<script>
  import MintFormComponent from "@/components/MintForm.vue";

  export default {
    name: "Mint",

    components: {
      MintFormComponent,
    },
  };
</script>

<style scoped>
</style>
