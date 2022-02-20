<template>
  <div class="operations">
    <div class="row">

      <!-- Price area -->
      <div class="col-12">
        <div class="card card-nft"
             style="width: 100%; height: auto;">
             <div class="card-body p-4">

               <div class="row justify-content-between">
                 <div class="col-12 col-lg-auto">
                   <p class="text-secondary mb-2">Selling price</p>
                   <VueCustomTooltip label="$WISP">
                     <div class="position-relative d-inline-block">
                       <img alt="$WISP"
                            src="@/assets/images/token-logo-32x32.png">
                     </div>
                   </VueCustomTooltip>
                   <span class="fw-bold fs-3 align-middle"> 1200.6</span>
                 </div>
                 <div class="col-12 col-lg-auto mt-4 mt-lg-0">
                   <button type="button" class="btn btn-secondary" v-if="!sellEnabled" @click="initSell">
                     <i class="fa-solid fa-scale-balanced me-1"></i>Sell
                   </button>
                 </div>
               </div>

               <div class="card card-nft mt-4" v-if="sellEnabled">
                 <div class="row m-0">
                   <div class="col-12 p-0 pt-1 text-end">
                     <button type="button" class="btn btn-primary" @click="initSell">
                       <i class="fa-solid fa-x"></i>
                     </button>
                   </div>
                   <div class="col-12 px-4 pt-0 pb-4">
                     <SellFormComponent />
                   </div>
                 </div>
               </div>

             </div>
        </div>
      </div> <!-- Price area -->

    </div>
  </div> <!-- Operations -->
</template>

<script>
  import SellFormComponent from "@/components/nftDetails/SellForm.vue";

  export default {
    name: "OperationsComponent",

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

    data() {
      return {
        sellEnabled: false,
      }
    },

    methods: {
      initSell() {
        // this.sellEnabled = true;
        this.sellEnabled = ! this.sellEnabled;
      },
    },

    components: {
      SellFormComponent,
    },
  }
</script>

<style scoped>
</style>
