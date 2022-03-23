<template>
  <div class="nft-details">
    <div class="container my-4 px-3 px-lg-0">
      <div class="row">

        <!-- Title mobile formats -->
        <div class="col-12 d-lg-none mb-1">
          <TitleComponent :isLoading="isLoading"
                          :nft="nft"
                          @refresh="handelRefresh" />
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
                          :nft="nft"
                          @refresh="handelRefresh" />
          <OperationsComponent :isLoading="isLoading"
                               :nft="nft"
                               @refresh="handelRefresh" />
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
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { mapGetters } from "vuex";

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
          metadata: null,
          price: null
        },
      }
    },

    created() {
      setTimeout(async () => {
        await this.init();
        await this.getNftMetadata();
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      async init() {
        const owner = await this.treasureNFT.methods.ownerOf(this.nft.tokenId).call();
        if (owner.toLowerCase() == this.merchant._address.toLowerCase()) {
          const sales = await this.merchant.methods.salesOf(this.wallet.address).call();
          for (let i = 0; i < sales; i ++) {
            let sale = await this.merchant.methods.saleOfOwnerByIndex(this.wallet.address, i).call();
            if (sale.tokenId == this.nft.tokenId) {
              this.nft.price = this.web3.utils.fromWei(sale.price);
              break;
            }
          }
        } else {
          this.nft.price = null;
        }
      },

      async getNftMetadata() {
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

      handelRefresh() {
        this.isLoading = true;
        setTimeout(async () => {
          await this.init();
          await this.getNftMetadata();
        }, 500);
      },
    },

    mixins: [
      merchantMixin,
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
