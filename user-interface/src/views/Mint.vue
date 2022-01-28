<template>
  <div class="mint">
      <div class="row justify-content-evenly my-5 mx-0">

        <!-- Mint -->
        <div class="col-4">
          <div class="box px-5 pt-4 pb-5">
            <div class="text-center">
              <h2 class="mb-2">Mint</h2>
              <h6>Create a new Treasure ($TRS) NFT</h6>
            </div>
            <MintFormComponent class="mt-4" />
          </div>
        </div> <!-- Mint -->

        <!-- User NFTs -->
        <div class="col-7 box px-5 py-4">
          <h2 class="text-center">Available NFTs</h2>
          <div class="row justify-content-start mt-5 px-0">

            <!-- Placeholder -->
            <template v-if="isLoading">
              <div class="col-auto mb-3" style="padding-left: 8px; padding-right: 8px;" v-for="index in balanceOfUser" :key="index">
                <div class="card card-auction" style="width: 14rem; height: 17.5rem;">
                  <div class="card-body p-0">
                    <div class="card-img-wrap-auction placeholder-glow">
                      <span class="card-img-auction placeholder col-12"></span>
                    </div>
                    <div class="text-center mx-3 mt-3 placeholder-glow">
                      <span class="placeholder col-5"></span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- NFTs -->
            <template v-else>
              <div class="col-auto mb-3" style="padding-left: 8px; padding-right: 8px;" v-for="(nft, index) in nfts" :key="index">
                <div class="card card-auction" style="width: 14rem; height: 17.5rem;">
                  <div class="card-body p-0">
                    <div class="card-img-wrap-auction">
                      <img alt="product image"
                           class="card-img-auction"
                           v-if="nft.image"
                           :src="nft.image">
                      <i class="fa-regular fa-image position-absolute top-50 start-50 translate-middle image-icon"
                         v-else>
                      </i>
                    </div>
                    <p class="text-truncate text-center fw-bold mx-3 mt-3">{{ nft.name }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div> <!-- User NFTs -->

      </div>
  </div>
</template>

<script>
  import MintFormComponent from "@/components/mint/MintForm.vue";
  import { mapGetters } from "vuex";
  import { apiService } from "@/common/api.service.js";

  export default {
    name: "Mint",

    data() {
      return {
        nfts: [],
        treasureNft: null,
        balanceOfUser: null,
        firstLoading: true,
        loadingNfts: false,
      }
    },

    created() {
      /*
        Create TreasureNFT contract instance.
      */

      let Interface = require("../../../smart-contracts/artifacts/contracts/TreasureNFT.sol/TreasureNFT.json");
      let Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      this.treasureNft = new this.web3.eth.Contract(Interface.abi, Address);

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
        const balance = await this.treasureNft.methods.balanceOf(this.wallet.address).call();
        this.balanceOfUser = parseInt(balance);
      },

      async getNfts() {
        this.loadingNfts = true;
        for (let i = 0; i < this.balanceOfUser; i ++) {
          let tokenId = await this.treasureNft.methods.tokenOfOwnerByIndex(this.wallet.address, i).call();
          let tokenUri = await this.treasureNft.methods.tokenURI(tokenId).call();


          await apiService(tokenUri)
            .then(response => {
              this.nfts.push(response);
            })
            .catch(error => {
              console.log(error);
            });
        }
        this.loadingNfts = false;
      },
    },

    components: {
      MintFormComponent,
    },
  };
</script>

<style scoped>
  .box {
    border-radius: 12px;
    background-color: #2c2c2c;
  }

  .card-auction {
    border-radius: 12px;
    border: 1px solid hsla(0,0%,100%,.2);
    background-color: #2e2d2c;
    overflow: hidden;
    transition: transform 0.2s ease;
  }

  .card-auction:hover {
    box-shadow: 0px 0px 7px 1px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .card-img-wrap-auction {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
  }

  .card-img-auction {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: auto;
  }

  .image-icon {
    font-size: 64px;
    color: #fff;
  }
</style>
