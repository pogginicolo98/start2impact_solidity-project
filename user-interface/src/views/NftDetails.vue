<template>
  <div class="nft-details">
    <div class="container mt-3 mt-lg-5 px-3 px-lg-0">
      <div class="row">

        <!-- Title mobile formats -->
        <div class="col-12 d-lg-none mb-1">
          <TitleComponent :isLoading="isLoading"
                          :nft="nft" />
        </div>

        <!-- Image -->
        <div class="col-12 col-lg-5 ps-lg-4 pe-lg-3 mb-4">
          <ImageDetailsComponent :isLoading="isLoading"
                                 :nft="nft" />
        </div>

        <!-- Title -->
        <div class="col-12 col-lg-7 pe-lg-4 mb-4">
          <TitleComponent class="d-none d-lg-block mb-5"
                          :isLoading="isLoading"
                          :nft="nft" />
          <OperationsComponent :isLoading="isLoading"
                               :nft="nft" />
        </div> <!-- Title -->

        <!-- Info -->
        <div class="col-12 col-lg-5 ps-lg-4 pe-lg-3">
          <InfoComponent :isLoading="isLoading"
                               :nft="nft" />
        </div> <!-- Info -->

      </div>
    </div>
  </div> <!-- NFT details -->
</template>

<script>
  import { apiService } from "@/common/api.service.js";
  import ImageDetailsComponent from "@/components/nftDetails/ImageDetails.vue";
  import InfoComponent from "@/components/nftDetails/Info.vue";
  import OperationsComponent from "@/components/nftDetails/Operations.vue";
  import TitleComponent from "@/components/nftDetails/Title.vue";
  import treasureNFTMixin from "@/mixins/TreasureNFT";

  export default {
    name: "NftDetails",

    props: {
      tokenId: {
        type: String,
        required: true
      },
    },

    data() {
      return {
        isLoading: true,
        nft: {
          tokenId: this.tokenId,
          metadata: null
        },
      }
    },

    created() {
      setTimeout(async () => {
        await this.getNft();
      }, 500);
    },

    methods: {
      async getNft() {
        let tokenUri = await this.treasureNFT.methods.tokenURI(this.nft.tokenId).call();
        await apiService(tokenUri)
          .then(response => {
            this.nft.metadata = response;
          })
          .catch(error => {
            console.log(error);
          });
        this.isLoading = false;
      },
    },

    mixins: [
      treasureNFTMixin,
    ],

    components: {
      ImageDetailsComponent,
      OperationsComponent,
      InfoComponent,
      TitleComponent,
    },
  };
</script>

<style scoped>
</style>
