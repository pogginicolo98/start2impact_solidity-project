<template>
  <div class="nft-card">
    <div class="card card-nft"
         style="width: 14rem; height: 17.5rem;">
         <div class="card-body p-0">
           <div class="card-nft-img-wrap">

             <!-- Image placeholder -->
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
                style="font-size: 64px;"
                v-else>
             </i>
           </div>

           <!-- Name placeholder -->
           <div class="placeholder-glow text-center mx-3 mt-3"
                v-if="isLoading">
                <span class="placeholder col-5"></span>
           </div>

           <!-- Name -->
           <p class="text-truncate text-center fw-bold mx-3 mt-3"
              v-else
              >{{ nft.metadata.name }}
           </p>

         </div>
    </div>
  </div> <!-- NFT card -->
</template>

<script>
  export default {
    name: "NftCardComponent",

    props: {
      nft: {
        type: Object,
        required: false,
      },
    },

    computed: {
      isLoading() {
        return this.nft == null || this.nft.metadata == null;
      },
    },
  }
</script>

<style scoped>
  .card-nft:hover {
    box-shadow: 0px 0px 7px 1px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
</style>
