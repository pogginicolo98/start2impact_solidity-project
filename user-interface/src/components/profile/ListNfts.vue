<template>
  <div class="list-nfts">
    <div class="row justify-content-start px-0 mt-5">

      <!-- Placeholder -->
      <template v-if="isLoading">
        <div class="col-auto col-nft mb-3"
             v-for="index in balanceOfUser"
             :key="index">
             <NftCardComponent :isLoading="isLoading" />
        </div>
      </template>

      <!-- Items -->
      <template v-else-if="nfts.length > 0">
        <div class="col-auto col-nft mb-3"
             v-for="(nft, index) in nfts"
             :key="index">
             <router-link class="nav-link text-secondary"
                          :disabled="isLoading"
                          :to="{ name: 'NftDetails', params: { tokenId: nft.tokenId } }">
                          <NftCardComponent :isLoading="isLoading"
                                            :metadata="nft.metadata" />
             </router-link>
        </div>
      </template>

      <!-- No items -->
      <template v-else>
        <p class="text-center fs-3 my-5">No items to display</p>
      </template>

    </div>
  </div> <!-- List NFTs -->
</template>

<script>
  import NftCardComponent from "@/components/profile/listNfts/NftCard.vue";
  import { apiService } from "@/common/api.service.js";
  import { mapGetters } from "vuex";
  import treasureNFTMixin from "@/mixins/TreasureNFT";

  export default {
    name: "ListNftsComponent",

    props: {
      tokenId: {
        type: String,
        required: false,
      },
    },

    watch: {
      tokenId() {
        this.onNftMinted(this.tokenId);
      },
    },

    data() {
      return {
        firstLoading: true,
        loadingNfts: false,
        balanceOfUser: null,
        nfts: [],
      };
    },

    created() {
      setTimeout(async () => {
        await this.countNfts();
        await this.getNfts();
        this.firstLoading = false;
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      isLoading() {
        return this.firstLoading == true && this.balanceOfUser > 0;
      },
    },

    methods: {
      async countNfts() {
        const balance = await this.treasureNFT.methods.balanceOf(this.wallet.address).call();
        this.balanceOfUser = parseInt(balance);
      },

      async getNfts() {
        this.loadingNfts = true;
        for (let i = 0; i < this.balanceOfUser; i ++) {
          let tokenId = await this.treasureNFT.methods.tokenOfOwnerByIndex(this.wallet.address, i).call();
          let tokenUri = await this.treasureNFT.methods.tokenURI(tokenId).call();
          await apiService(tokenUri)
            .then(response => {
              let nft = {
                tokenId: tokenId,
                metadata: response
              };
              this.nfts.push(nft);
            })
            .catch(error => {
              console.log(error);
            });
        }
        this.loadingNfts = false;
      },

      async onNftMinted(tokenId) {
        this.loadingNfts = true;
        let tokenUri = await this.treasureNFT.methods.tokenURI(tokenId).call();
        await apiService(tokenUri)
          .then(response => {
            let nft = {
              tokenId: tokenId,
              metadata: response
            };
            this.nfts.push(nft);
          })
          .catch(error => {
            console.log(error);
          });
        this.loadingNfts = false;
      },
    },

    mixins: [
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
