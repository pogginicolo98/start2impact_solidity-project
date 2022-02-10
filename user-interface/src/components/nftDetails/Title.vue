<template>
  <div class="title">
    <div class="row">

      <!-- Buttons area -->
      <div class="col-12 text-end mb-4 mb-lg-2">
        <div class="btn-group" role="group" aria-label="Basic outlined example">
          <button type="button" class="btn btn-primary">Left</button>
          <button type="button" class="btn btn-primary">Middle</button>
        </div>
      </div>

      <!-- Name area -->
      <div class="col-12">

        <!-- placeholder -->
        <template v-if="isLoading">
          <h2 class="placeholder-glow">
            <span class="placeholder col-2"></span>
          </h2>
          <p class="placeholder-glow">
            <span class="placeholder col-3"></span>
          </p>
        </template>

        <!-- Name -->
        <template v-else>
          <h2 class="text-truncate">{{ nft.metadata.name }}</h2>
          <p class="text-secondary">Owned by <a href="#">OWNER</a></p>
        </template>

      </div> <!-- Name area -->

    </div>
  </div> <!-- Title -->
</template>

<script>
  export default {
    name: "TitleComponent",

    props: {
      isLoading: {
        type: Boolean,
        required: true
      },
      nft: {
        type: Object,
        required: false
      },
    },
  }
</script>

<style scoped>
</style>
