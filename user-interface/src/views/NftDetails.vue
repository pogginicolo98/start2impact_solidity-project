<template>
  <div class="nft-details">
      <div class="row justify-content-between m-5">

        <!-- Mint -->
        <div class="col-4">
          <div class="box px-5 pt-4 pb-5">
            <div class="text-center">
              <h2 class="mb-2">Mint</h2>
              <h6>Create a new Treasure ($TRS) NFT</h6>
            </div>
            <!-- <MintComponent class="mt-4"
                               @nftMinted="onNftMinted($event)"/> -->
          </div>
        </div>

        <!-- User NFTs -->
        <div class="col-7">
          <div class="box px-5 pt-4 pb-5">
            <h2 class="text-center">Available Treasure NFTs</h2>
            <!-- <ListNftsComponent :tokenId="tokenId"/> -->
          </div>
        </div>
      </div>

  </div> <!-- NFT details -->
</template>

<script>
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { apiService } from "@/common/api.service.js";

  export default {
    name: "NftDetails",

    props: {
      tokenId: {
        type: String,
        required: true,
      },
    },

    data() {
      return {
        isLoading: true,
        metadata: null,
      };
    },

    async created () {
      let tokenUri = await this.treasureNFT.methods.tokenURI(this.tokenId).call();
      await apiService(tokenUri)
        .then(response => {
          this.metadata = response;
        })
        .catch(error => {
          console.log(error);
        });
      this.isLoading = false;
    },

    mixins: [
      treasureNFTMixin,
    ],
  };
</script>

<style scoped>
  .box {
    border-radius: 12px;
    background-color: #2c2c2c;
  }
</style>
