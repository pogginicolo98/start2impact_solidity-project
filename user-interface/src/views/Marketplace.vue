<template>
  <div class="marketplace">
    <div class="container height-100 mt-4">

         <!-- Title -->
         <div class="text-center" v-if="nfts.length > 0 && !loadingNfts">
           <h1 class="mt-5 mb-3">Treasures for sale</h1>
         </div>

         <!-- Items -->
         <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 row-cols-xxl-5 g-3 mt-5 mb-4" v-if="nfts.length > 0 && !loadingNfts">
           <div class="col"
                v-for="(nft, index) in nfts"
                :key="index">
                <NftCardComponent v-if="!nft.metadata" />
                <router-link class="text-light"
                             v-else
                             :to="{ name: 'NftDetails', params: { tokenId: nft.tokenId,
                                                                  metadata: nft.metadata,
                                                                  price: nft.price,
                                                                  owner: nft.owner } }">
                             <NftCardComponent :nft="nft" :marketplace="true" />
                </router-link>
           </div>
         </div>

         <!-- No live auctions ******************** -->
         <div class="d-flex justify-content-center align-items-center height-100"
              v-else-if="!loadingNfts">
              <div class="text-center">
                <i class="fa-solid fa-face-frown fs-45px mb-4"></i>
                <h5 class="text-secondary">Sorry, I have no treasures for sale at the moment...</h5>
              </div>
         </div>

         <!-- Spinner -->
         <div class="d-flex justify-content-center align-items-center height-100"
              v-show="loadingNfts">
              <div class="spinner-border text-secondary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
         </div>

    </div>
  </div>
</template>

<script>
  import { apiService } from "@/common/api.service.js";
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { mapGetters } from "vuex";

  import NftCardComponent from "@/components/profile/listNfts/NftCard.vue";

  export default {
    name: "Marketplace",

    data() {
      return {
        loadingNfts: true,
        nfts: [],
      }
    },

    created() {
      setTimeout(async () => {
        await this.getNfts();
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
        ipfs: "getIpfs",
      }),
    },

    methods: {
      async getNfts() {
        const sellers = await this.merchant.methods.totalSellers().call();
        for (let sellerIndex = 0; sellerIndex < sellers; sellerIndex++) {
          let sellerAddress = await this.merchant.methods.sellerByIndex(sellerIndex).call();
          let sellerSales = await this.merchant.methods.salesOf(sellerAddress).call();
          for (let saleIndex = 0; saleIndex < sellerSales; saleIndex++) {
            let nft = {
              tokenId: null,
              metadata: null,
              price: null,
              owner: null
            };
            let sale = await this.merchant.methods.saleOfOwnerByIndex(sellerAddress, saleIndex).call();
            nft.tokenId = sale.tokenId;
            nft.price = this.web3.utils.fromWei(sale.price);
            nft.owner = sellerAddress;
            let tokenUri = await this.treasureNFT.methods.tokenURI(sale.tokenId).call();
            await apiService(tokenUri)
              .then(response => {
                nft.metadata = response;
              })
              .catch(error => {
                console.log(error);
              });
            this.nfts.push(nft);
          }
        }
        this.loadingNfts = false;
      },
    },

    mixins: [
      treasureNFTMixin,
      merchantMixin,
    ],

    components: {
      NftCardComponent,
    },
  };
</script>

<style scoped>
  .marketplace {
    height: 100%;
  }
</style>
