<template>
  <div class="nft-card">
    <div class="card card-nft"
         style="width: 100%;">
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
           <div class="placeholder-glow mb-3"
                v-if="isLoading">
                <div class="row justify-content-between mt-3 px-2">
                  <div class="col-6">
                    <div>
                      <span class="placeholder col-4 fs-12px"></span>
                    </div>
                    <div>
                      <span class="placeholder col-7"></span>
                    </div>
                  </div>
                  <div class="col-6 text-end">
                    <div>
                      <span class="placeholder col-4 fs-12px"></span>
                    </div>
                    <div>
                      <span class="placeholder col-10"></span>
                    </div>
                  </div>
                </div>
           </div>

           <!-- Name -->
           <div class="row justify-content-between mt-3 px-2" v-else>
             <div class="col-6">
               <p class="name-card text-muted">Name</p>
               <p class="text-truncate">{{ nft.metadata.name }}</p>
             </div>
             <div class="col-6 text-end">
               <i class="fa-solid fa-coins text-muted fs-12px mb-0"></i>
               <div v-if="nft.price">
                 <p class="text-truncate">
                   <span>
                     <div class="position-relative d-inline-block">
                       <img alt="$WISP"
                            src="@/assets/images/token-logo-24x24.png">
                     </div>
                   </span>
                   <span class="align-middle">{{ nft.price }}</span>
                 </p>
               </div>
               <p class="text-secondary" v-else>Not for sale</p>
             </div>
           </div>

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
  .card-nft-img-wrap {
    border-bottom: 1px solid hsla(0,0%,100%,.1);
  }

  .card-nft:hover {
    box-shadow: 0px 0px 7px 1px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .name-card {
    margin-top: 2px;
    margin-bottom: 4px;
    font-size: 12px;
  }
</style>
