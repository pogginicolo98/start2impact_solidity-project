<template>
  <div class="operations">
    <div class="row">

      <!-- Placeholder -->
      <div class="col-12"
           v-if="isLoading">
           <div class="card card-nft"
                style="width: 100%; height: auto;">
                <div aria-hidden="true"
                     class="placeholder-glow"
                     style="width:100%; height:100%">
                     <span class="placeholder col-12"
                           style="height:112px">
                     </span>
                </div>
           </div>
      </div>

      <!-- Content -->
      <div class="col-12"
           v-else>
           <div class="card card-nft"
                style="width: 100%; height: auto;">
                <div class="card-body p-4">

                  <!-- NFT not for sale -->
                  <div class="row"
                       v-if="!nft.price">

                       <!-- Price info -->
                       <div class="col-12 col-lg-9">
                         <p class="text-secondary mb-2">Selling price</p>
                         <h3>Not for sale</h3>
                       </div>

                       <!-- Sell button -->
                       <div class="col-12 col-lg-3 mt-4 mt-lg-0"
                            v-if="isOwner">
                         <div class="d-grid">
                           <button class="btn btn-secondary my-2"
                                   type="button"
                                   v-if="!formEnabled"
                                   @click="formEnabled = !formEnabled"
                                   ><i class="fa-solid fa-scale-balanced me-2"></i>Sell
                           </button>
                         </div>
                       </div>

                  </div>

                  <!-- NFT for sale -->
                  <div class="row justify-content-between"
                       v-else>

                       <!-- Price info -->
                       <div class="col-12 col-lg-9">
                         <p class="text-secondary mb-2">Selling price</p>
                         <VueCustomTooltip label="$WISP">
                           <div class="position-relative d-inline-block">
                             <img alt="$WISP"
                                  src="@/assets/images/token-logo-32x32.png">
                           </div>
                         </VueCustomTooltip>
                         <span class="fs-24px fw-bold align-middle ms-1">{{ getPrice }}</span>
                       </div>

                       <!-- Cancel button -->
                       <div class="col-12 col-lg-3 mt-4 mt-lg-0"
                            v-if="isOwner">
                            <CancelFormComponent :tokenId="nft.tokenId"
                                                 @saleCanceled="refresh()" />
                       </div>

                       <!-- Buy button -->
                       <div class="col-12 col-lg-3 mt-4 mt-lg-0"
                            v-else>
                            <div class="d-grid">
                              <button class="btn btn-secondary my-2"
                                      type="button"
                                      v-if="!formEnabled"
                                      @click="formEnabled = !formEnabled"
                                      ><i class='fa-solid fa-sack-dollar me-2'></i>Purchase
                              </button>
                            </div>
                       </div>

                  </div>

                  <!-- Sell form -->
                  <div v-if="isOwner">
                    <div class="row m-0"
                         v-show="formEnabled">
                         <div class="col-12 p-0 pt-1 text-end">
                           <button class="btn btn-primary"
                                   type="button"
                                   @click="formEnabled = !formEnabled"
                                   ><i class="fa-solid fa-x"></i>
                           </button>
                         </div>
                         <div class="col-12 px-4 pt-0 pb-4">
                           <SellFormComponent :tokenId="nft.tokenId"
                                              @saleCreated="refresh()" />
                         </div>
                    </div>
                  </div>

                  <!-- Buy form -->
                  <div v-else>
                    <div class="row m-0"
                         v-show="formEnabled">
                         <div class="col-12 p-0 pt-1 text-end">
                           <button class="btn btn-primary"
                                   type="button"
                                   @click="formEnabled = !formEnabled"
                                   ><i class="fa-solid fa-x"></i>
                           </button>
                         </div>
                         <div class="col-12 px-4 pt-0 pb-4">
                           <BuyFormComponent :tokenId="nft.tokenId"
                                             :price="nft.price"
                                             @saleExecuted="refresh()" />
                         </div>
                    </div>
                  </div>

                </div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import BuyFormComponent from "@/components/nft-detail/forms/BuyForm.vue";
  import CancelFormComponent from "@/components/nft-detail/forms/CancelForm.vue";
  import SellFormComponent from "@/components/nft-detail/forms/SellForm.vue";
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";

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
        formEnabled: false,
      }
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      isOwner() {
        return this.nft.owner.toLowerCase() == this.wallet.address.toLowerCase();
      },

      getPrice() {
        return this.web3.utils.fromWei(this.nft.price);
      },
    },

    methods: {
      refresh() {
        this.formEnabled = false;
        this.$emit('refresh');
      },
    },

    mixins: [
      merchantMixin,
      treasureNFTMixin,
    ],

    components: {
      BuyFormComponent,
      CancelFormComponent,
      SellFormComponent,
    },
  }
</script>

<style scoped>
</style>
