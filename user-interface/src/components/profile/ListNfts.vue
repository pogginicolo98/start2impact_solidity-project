<template>
  <div class="list-nfts">
    <div class="row justify-content-start px-0 mt-5">

      <!-- Loading -->
      <template v-if="firstLoading">
        <div class="col-auto col-nft mb-3"
             v-for="index in balanceOfUser"
             :key="index">
             <NftCardComponent />
        </div>
      </template>

      <!-- Items -->
      <template v-else-if="nfts.length > 0">
        <div class="col-auto col-nft mb-3"
             v-for="(nft, index) in nfts"
             :key="index">
             <NftCardComponent v-if="!nft.metadata" />
             <router-link class="text-secondary"
                          v-else
                          :to="{ name: 'NftDetails', params: { tokenId: nft.tokenId } }">
                          <NftCardComponent :nft="nft" />
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
        required: false
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
        balanceOfUser: null,
        nfts: [],
      }
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
    },

    methods: {
      async countNfts() {
        const balance = await this.treasureNFT.methods.balanceOf(this.wallet.address).call();
        this.balanceOfUser = parseInt(balance);
      },

      async getNfts() {
        for (let i = 0; i < this.balanceOfUser; i ++) {
          let nft = {
            tokenId: null,
            metadata: null,
          };
          let tokenId = await this.treasureNFT.methods.tokenOfOwnerByIndex(this.wallet.address, i).call();
          nft.tokenId = tokenId;
          let tokenUri = await this.treasureNFT.methods.tokenURI(tokenId).call();
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

      async onNftMinted(tokenId) {
        let nft = {
          tokenId: tokenId,
          metadata: null,
        };
        let tokenUri = await this.treasureNFT.methods.tokenURI(tokenId).call();
        await apiService(tokenUri)
          .then(response => {
            nft.metadata = response;
          })
          .catch(error => {
            console.log(error);
          });
        this.nfts.push(nft);
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
