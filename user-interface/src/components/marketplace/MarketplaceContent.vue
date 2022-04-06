<template>
  <div class="marketplace-content">

    <!-- Title -->
    <div class="text-center"
         v-if="nftsForSale">
         <h1 class="mt-5 mb-3">Items for sale</h1>
    </div>

    <!-- Nfts for sale -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 row-cols-xxl-5 g-3 mt-5 mb-4"
         v-if="nftsForSale">
         <div class="col"
              v-for="(nft, index) in nfts"
              :key="index">
              <NftCardComponent v-if="!nft.metadata" />
              <router-link class="text-light"
                           v-else
                           :to="{ name: 'NFTDetail', params: { tokenId: nft.tokenId,
                                                               metadata: nft.metadata,
                                                               price: nft.price,
                                                               owner: nft.owner } }">
                           <NftCardComponent :marketplace="true"
                                             :nft="nft" />
              </router-link>
         </div>
    </div>

    <!-- No NFTs for sale -->
    <div class="d-flex justify-content-center align-items-center height-100"
         v-else>
         <div class="text-center">
           <i class="fa-solid fa-shop-slash fs-70px mb-4"></i>
           <h2>Sorry, there are currently no items for sale</h2>
         </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { apiService } from "@/common/api.service.js";
  import NftCardComponent from "@/components/utility/NftCard.vue";
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";

  export default {
    name: "MarketplaceContentComponent",

    data() {
      return {
        loading: true,
        nfts: [],
      }
    },

    created() {
      setTimeout(async () => {
        await this.retrieveNfts();
        this.loading = false;
      }, 500);
    },

    watch: {
      loading() {
        this.$emit('loadingStatus', this.loading);
      },
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
        ipfs: "getIpfs",
      }),

      nftsForSale() {
        return this.nfts.length > 0 && !this.loading;
      },
    },

    methods: {
      async retrieveNfts() {
        // Retrieve all NFTs for sale from Merchant smart contract
        try {
          let sellers = await this.merchant.methods.totalSellers().call();

          for (let sellerIndex = 0; sellerIndex < sellers; sellerIndex++) {
            let sellerAddr = await this.merchant.methods.sellerByIndex(sellerIndex).call();
            let sales = await this.merchant.methods.salesOf(sellerAddr).call();

            for (let saleIndex = 0; saleIndex < sales; saleIndex++) {
              let sale = await this.merchant.methods.saleOfOwnerByIndex(sellerAddr, saleIndex).call();
              let tokenId = sale.tokenId != null ? sale.tokenId : null;
              let metadata = null;
              let owner = sellerAddr != null ? sellerAddr : null;
              let price = sale.price != null ? sale.price : null;
              let tokenUri = await this.treasureNFT.methods.tokenURI(sale.tokenId).call();

              // Retrieve metadata
              await apiService(tokenUri)
                .then(response => {
                  metadata = response;
                })
                .catch(error => {
                  console.log(error);
                });

              let nft = {
                tokenId: tokenId,
                metadata: metadata,
                owner: owner,
                price: price,
              }

              this.nfts.push(nft);
            }
          }
        } catch (error) {
          console.log("An error occurred while calling the method: retrieveNftsForSale");
          console.log(error);
        }
      },
    },

    mixins: [
      merchantMixin,
      treasureNFTMixin,
    ],

    components: {
      NftCardComponent,
    },
  }
</script>

<style scoped>
  .marketplace-content {
    height: 100%;
  }
</style>
