<template>
  <div class="page-not-found">
    <div class="d-flex justify-content-center align-items-center height-100">
         <div class="text-center">
           <i class="fa-solid fa-face-frown fs-70px mb-4"></i>
           <h2 class="text-secondary">Error 404: page not found</h2>
           <h5 class="text-secondary">Something went wrong, the page you are looking for does not exist</h5>
         </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PageNotFound",
  };
</script>

<style scoped>
  .page-not-found {
    height: 100%;
  }
</style>
