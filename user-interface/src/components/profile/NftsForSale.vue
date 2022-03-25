<template>
  <div class="nfts-for-sale">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 g-3 mt-5 mb-4">

      <!-- Loading -->
      <template v-if="isLoading">
        <div class="col"
             v-for="index in balanceOfUser"
             :key="index">
             <NftCardComponent />
        </div>
      </template>

      <!-- Items -->
      <template v-else-if="nfts.length > 0">
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
                          <NftCardComponent :nft="nft" />
             </router-link>
        </div>
      </template>

      <!-- No items -->
      <template v-else>
        <p class="text-center text-secondary fs-5 my-5">No items to display</p>
      </template>

    </div>
  </div> <!-- NFTs for sale -->
</template>

<script>
  import { apiService } from "@/common/api.service.js";
  import NftCardComponent from "@/components/profile/listNfts/NftCard.vue";
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { mapGetters } from "vuex";

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
          nft.price = this.web3.utils.fromWei(sale.price);
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
