<template>
  <div class="nfts-for-sale">
    <div class="mt-5 mb-4">

      <!-- Loading -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 g-3" v-if="isLoading">
        <div class="col"
             v-for="index in balanceOfUser"
             :key="index">
             <NftCardComponent />
        </div>
      </div>

      <!-- Items -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 g-3" v-else-if="nfts.length > 0">
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
                          <NftCardComponent :nft="nft" />
             </router-link>
        </div>
      </div>

      <!-- No items -->
      <div class="text-center" v-else>
        <i class="fa-solid fa-ellipsis text-secondary fs-5 my-5"></i>
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
    name: "NftsForSaleComponent",

    data() {
      return {
        isLoading: true,
        balanceOfUser: null,
        nfts: [],
      }
    },

    created() {
      setTimeout(async () => {
        await this.countNfts();
        await this.getNfts();
        this.isLoading = false;
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      async countNfts() {
        const balance = await this.merchant.methods.salesOf(this.wallet.address).call();
        this.balanceOfUser = parseInt(balance);
      },

      async getNfts() {
        for (let i = 0; i < this.balanceOfUser; i ++) {
          let nft = {
            tokenId: null,
            metadata: null,
            price: null,
            owner: this.wallet.address
          };
          let sale = await this.merchant.methods.saleOfOwnerByIndex(this.wallet.address, i).call();
          nft.tokenId = sale.tokenId;
          nft.price = sale.price;
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
  .col-nft {
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
