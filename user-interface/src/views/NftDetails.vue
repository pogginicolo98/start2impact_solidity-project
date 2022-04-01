<template>
  <div class="nft-details">
    <div class="d-flex justify-content-center align-items-center height-100"
         v-if="notFound">
         <div class="text-center">
           <i class="fa-solid fa-face-frown fs-70px mb-4"></i>
           <h2 class="text-secondary">The item you are looking for does not exist</h2>
         </div>
    </div>

    <div class="container my-4 px-3 px-lg-0" v-else>
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
      metadata: {
        type: Object,
        required: false
      },
      price: {
        type: String,
        required: false
      },
      owner: {
        type: String,
        required: false
      },
    },

    data() {
      return {
        isLoading: true,
        notFound: false,
        nft: {
          tokenId: this.tokenId,
          metadata: this.metadata != null ? this.metadata : null,
          price: this.price != null ? this.price : null,
          owner: this.owner != null ? this.owner : null,
        },
      }
    },

    created() {
      setTimeout(async () => {
        await this.initNft();
        this.isLoading = false;
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      async getNftMetadata() {
        console.log("get metadata");
        let tokenUri = await this.treasureNFT.methods.tokenURI(this.nft.tokenId).call();
        await apiService(tokenUri)
          .then(response => {
            this.nft.metadata = response;
          })
          .catch(error => {
            console.log(error);
          });
      },

      async getNftSale() {
        console.log("get sale");
        let sellers = await this.merchant.methods.totalSellers().call();
        for (let sellerIndex = 0; sellerIndex < sellers; sellerIndex++) {
          let sellerAddress = await this.merchant.methods.sellerByIndex(sellerIndex).call();
          let sellerSales = await this.merchant.methods.salesOf(sellerAddress).call();
          for (let saleIndex = 0; saleIndex < sellerSales; saleIndex++) {
            let sale = await this.merchant.methods.saleOfOwnerByIndex(sellerAddress, saleIndex).call();
            if (sale.tokenId == this.nft.tokenId) {
              this.nft.price = this.web3.utils.fromWei(sale.price);
              this.nft.owner = sellerAddress;
              break;
            }
          }
        }
      },

      async getNftOwner() {
        let owner;
        this.treasureNFT.methods.ownerOf(this.nft.tokenId).call()
          .then(response => {
            owner = response;
          })
          .catch(error => {
            console.log(error);
            console.log("tokenid");
            this.notFound = true;
          });
        if (owner.toLowerCase() == this.merchant._address.toLowerCase()) {
          await this.getNftSale();
        } else {
          this.nft.owner = owner;
          console.log("not for sale");
        }
      },

      async initNft() {
        console.log("init nfts");
        if (this.nft.owner == null) {
          if (Number.isInteger(this.nft.tokenId)) {
            await this.getNftOwner();
            await this.getNftMetadata();
          } else {
            this.notFound = true;
          }
        }
      },

      handelRefresh() {
        this.isLoading = true;
        this.nft.metadata = null;
        this.nft.price = null;
        this.nft.owner = null;
        setTimeout(async () => {
          await this.initNft();
          this.isLoading = false;
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
  .nft-details {
    height: 100%;
  }
</style>
