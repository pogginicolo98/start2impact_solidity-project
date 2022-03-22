<template>
  <div class="operations">
    <div class="row">

      <div class="col-12" v-if="isLoading">
        <div class="card card-nft"
             style="width: 100%; height: auto;">
             <div class="placeholder-glow" style="width:100%; height:100%" aria-hidden="true">
               <span class="placeholder col-12" style="height:112px"></span>
             </div>
        </div>
      </div>

      <!-- Price area -->
      <div class="col-12" v-else>
        <div class="card card-nft"
             style="width: 100%; height: auto;">
             <div class="card-body p-4">

               <div class="row justify-content-center" v-if="!nft.price">
                 <div class="col-12 col-lg-5 col-xl-4 d-grid">
                   <button type="button" class="btn btn-lg btn-secondary my-2" v-if="!sellEnabled" @click="sellEnabled = !sellEnabled">
                     <i class="fa-solid fa-scale-balanced me-1"></i>Sell
                   </button>
                 </div>
               </div>

               <div class="row justify-content-between" v-else>
                 <div class="col-12 col-lg-9">
                   <p class="text-secondary mb-2">Selling price</p>
                   <VueCustomTooltip label="$WISP">
                     <div class="position-relative d-inline-block">
                       <img alt="$WISP"
                            src="@/assets/images/token-logo-32x32.png">
                     </div>
                   </VueCustomTooltip>
                   <span class="fw-bold fs-3 align-middle">{{ nft.price }}</span>
                 </div>
                 <div class="col-12 col-lg-3 mt-4 mt-lg-0">
                   <CancelFormComponent :tokenId="nft.tokenId"
                                        @saleCanceled="refresh()" />
                 </div>
               </div>

               <div class="row m-0" v-show="sellEnabled">
                 <div class="col-12 p-0 pt-1 text-end">
                   <button type="button" class="btn btn-primary" @click="sellEnabled = !sellEnabled">
                     <i class="fa-solid fa-x"></i>
                   </button>
                 </div>
                 <div class="col-12 px-4 pt-0 pb-4">
                   <SellFormComponent :tokenId="nft.tokenId"
                                      @saleCreated="refresh()" />
                 </div>
               </div>

             </div>
        </div>
      </div> <!-- Price area -->

    </div>
  </div> <!-- Operations -->
</template>

<script>
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import SellFormComponent from "@/components/nftDetails/SellForm.vue";
  import CancelFormComponent from "@/components/nftDetails/CancelForm.vue";
  import { mapGetters } from "vuex";

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

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      refresh() {
        this.sellEnabled = false;
        this.$emit('refresh');
      },
    },

    mixins: [
      merchantMixin,
      treasureNFTMixin,
    ],

    components: {
      SellFormComponent,
      CancelFormComponent,
    },
  }
</script>

<style scoped>
</style>
