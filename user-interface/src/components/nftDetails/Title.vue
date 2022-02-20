<template>
  <div class="title">
    <div class="row">

      <!-- Buttons area -->
      <div class="col-12 text-end mb-4 mb-lg-2">
        <VueCustomTooltip label="Refresh metadata">
          <button type="button" class="btn btn-outline-secondary" @click="emitRefresh">
            <i class="fa-solid fa-arrow-rotate-right"></i>
          </button>
        </VueCustomTooltip>
        <VueCustomTooltip label="Share">
          <button type="button" class="btn btn-outline-secondary ms-1" @click="copyToClipboard">
            <i class="fa-solid fa-share-nodes"></i>
          </button>
        </VueCustomTooltip>
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
          <p class="text-secondary">Owned by <a class="link-info" href="#">OWNER</a></p>
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

    methods: {
      emitRefresh() {
        this.$emit('refresh');
      },

      copyToClipboard() {
        this.$clipboard(window.location.href);
        this.$toasted.show(`Link copied`, {icon: "check"});
      },
    },
  }
</script>

<style scoped>
</style>
