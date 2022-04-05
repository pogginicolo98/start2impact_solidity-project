<template>
  <div class="nft-detail-content">

    <!-- NFT not found -->
    <div class="d-flex justify-content-center align-items-center height-100"
         v-if="notFound">
         <div class="text-center">
           <i class="fa-solid fa-ghost fs-70px mb-4"></i>
           <h2>The item you are looking for does not exist</h2>
         </div>
    </div>

    <!-- NFT detail -->
    <div class="container"
         v-else>

         <!-- Desktop version -->
         <div class="row g-4 d-none d-lg-flex">
           <div class="col-5">
             <div class="row g-4">
               <div class="col-12">
                 <ImageDetailsComponent :isLoading="loading"
                                        :nft="nft" />
               </div>
               <div class="col-12">
                 <InfoComponent :isLoading="loading"
                                :nft="nft" />
               </div>
             </div>
           </div>
           <div class="col-7">
             <div class="row g-4">
               <div class="col-12">
                 <TitleComponent :isLoading="loading"
                                 :nft="nft"
                                 @refresh="handelRefresh" />
               </div>
               <div class="col-12">
                 <OperationsComponent :isLoading="loading"
                                      :nft="nft"
                                      @refresh="handelRefresh" />
               </div>
             </div>
           </div>
         </div>

         <!-- Mobile version -->
         <div class="row g-4 d-flex d-lg-none">
           <div class="col-12">
             <TitleComponent :isLoading="loading"
                             :nft="nft"
                             @refresh="handelRefresh" />
           </div>
           <div class="col-12">
             <ImageDetailsComponent :isLoading="loading"
                                    :nft="nft" />
           </div>
           <div class="col-12">
             <OperationsComponent :isLoading="loading"
                                  :nft="nft"
                                  @refresh="handelRefresh" />
           </div>
           <div class="col-12">
             <InfoComponent :isLoading="loading"
                            :nft="nft" />
           </div>
         </div>

    </div>

  </div>
</template>

<script>
  import { apiService } from "@/common/api.service.js";
  import ImageDetailsComponent from "@/components/nft-detail/modules/ImageDetails.vue";
  import InfoComponent from "@/components/nft-detail/modules/Info.vue";
  import OperationsComponent from "@/components/nft-detail/modules/Operations.vue";
  import TitleComponent from "@/components/nft-detail/modules/Title.vue";
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";

  import { mapGetters } from "vuex";

  export default {
    name: "NFTDetailContentComponent",

    props: {
      propNft: {
        type: Object,
        required: true
      },
    },

    data() {
      return {
        loading: true,
        notFound: false,
        nft: this.propNft,
      }
    },

    created() {
      setTimeout(async () => {
        await this.initNft();
        this.loading = false;
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      async getMetadata(tokenId) {
        try {
          let tokenUri = await this.treasureNFT.methods.tokenURI(tokenId).call();
          let metadata = await apiService(tokenUri);
          return metadata;
        } catch (error) {
          console.log(error);
          return null;
        }

      },

      async getSale(tokenId) {
        try {
          let sellers = await this.merchant.methods.totalSellers().call();

          for (let sellerIndex = 0; sellerIndex < sellers; sellerIndex++) {
            let sellerAddress = await this.merchant.methods.sellerByIndex(sellerIndex).call();
            let sellerSales = await this.merchant.methods.salesOf(sellerAddress).call();

            for (let saleIndex = 0; saleIndex < sellerSales; saleIndex++) {
              let sale = await this.merchant.methods.saleOfOwnerByIndex(sellerAddress, saleIndex).call();

              if (sale.tokenId == tokenId) {
                return { owner: sellerAddress, price: sale.price };
              }
            }
          }

          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },

      async getOwner(tokenId) {
        try {
          let owner = await this.treasureNFT.methods.ownerOf(tokenId).call();
          return owner;
        } catch (error) {
          console.log(error);
          return null;
        }
      },

      async initNft() {
        if (this.nft.owner == null) {
          try {
            let owner = await this.getOwner(this.nft.tokenId);

            if (owner) {
              this.nft.owner = owner;
              if (owner.toLowerCase() == this.merchant._address.toLowerCase()) {
                let sale = await this.getSale(this.nft.tokenId);

                if (sale) {
                  this.nft.owner = sale.owner;
                  this.nft.price = sale.price;
                }
              }

              let metadata = await this.getMetadata(this.nft.tokenId);
              if (metadata) {
                this.nft.metadata = metadata;
              } else {
                this.notFound = true;
              }
            } else {
              this.notFound = true;
            }
          } catch (error) {
            console.log(error);
            this.notFound = true;
          }
        }
      },

      handelRefresh() {
        this.loading = true;
        this.nft.metadata = null;
        this.nft.price = null;
        this.nft.owner = null;
        setTimeout(async () => {
          await this.initNft();
          this.loading = false;
        }, 500);
      },
    },

    mixins: [
      merchantMixin,
      treasureNFTMixin,
    ],

    components: {
      ImageDetailsComponent,
      InfoComponent,
      OperationsComponent,
      TitleComponent,
    },
  };
</script>

<style scoped>
  .nft-detail-content {
    height: 100%;
  }
</style>
