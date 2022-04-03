<template>
  <div class="marketplace">
    <div class="container height-100 mt-4" v-if="!firstLoading && walletConnected">

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
                <i class="fa-solid fa-shop-slash fs-70px mb-4"></i>
                <h2>Sorry, there are currently no items for sale</h2>
              </div>
         </div>

    </div>

    <div class="height-100" v-else-if="!firstLoading && !walletConnected">
      <ConnectWalletComponent />
    </div>

    <!-- Spinner -->
    <div class="d-flex justify-content-center align-items-center height-100"
         v-else-if="firstLoading || loadingNfts">
         <div class="spinner-border text-secondary" style="width: 3rem; height: 3rem;" role="status">
           <span class="visually-hidden">Loading...</span>
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
  import ConnectWalletComponent from "@/components/ConnectWallet.vue";
  import walletConnectedMixin from "@/mixins/WalletConnected";

  export default {
    name: "Marketplace",

    data() {
      return {
        firstLoading: true,
        loadingNfts: true,
        nfts: [],
      }
    },

    created() {
      setTimeout(() => {
        this.firstLoading = false;
      }, 300);
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
      walletConnectedMixin,
    ],

    components: {
      NftCardComponent,
      ConnectWalletComponent,
    },
  };
</script>

<style scoped>
  .marketplace {
    height: 100%;
  }
</style>
