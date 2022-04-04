<template>
  <div class="spinner">
    <div class="d-flex justify-content-center align-items-center height-100">
      <div class="spinner-border text-secondary"
          role="status"
          style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SpinnerComponent",
  }
</script>

<style scoped>
  .spinner {
      height: 100%;
    }
</style>
