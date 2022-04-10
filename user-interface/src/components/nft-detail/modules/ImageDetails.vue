<template>
  <div class="image-details">
    <div class="card card-nft"
         style="width: 100%; height: auto;">
         <div class="card-body p-0">
           <div class="card-nft-img-wrap">

             <!-- placeholder -->
             <span class="placeholder col-12 card-nft-img"
                   v-if="isLoading">
             </span>

             <!-- Image -->
             <img alt="nft image"
                  class="card-nft-img"
                  v-else-if="nft.metadata.image"
                  :src="nft.metadata.image">

             <!-- Blank image -->
             <i class="fa-regular fa-image card-nft-icon position-absolute top-50 start-50 translate-middle"
                style="font-size: 128px;"
                v-else>
             </i>

           </div>
         </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ImageDetailsComponent",

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
