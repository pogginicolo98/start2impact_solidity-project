<template>
  <div class="mint">
    <div class="container mt-5">
      <div class="row">
        <!-- Title -->
        <div class="col text-center">
          <h1 class="mb-3">Create</h1>
          <h5>Mint a new Treasure Chest NFT</h5>
        </div>
      </div>

      <div class="row mt-5">
        <!-- Form -->
        <div class="col ">
          <MintFormComponent />
        </div>
      </div>

      <!-- NFTs list -->
      <div class="row mt-5">
        <div class="col-10 mt-2 mb-4">
          <button class="btn btn-primary"
                  @click="handleUri"
                  >Get URI
          </button>
        </div>
        <div class="col" v-for="(nft, index) in nfts" :key="index">
          <div class="card mb-3" style="width: 18rem;">
            <img :src="nft.image" class="card-img-top" alt="nft-image">
            <div class="card-body">
              <h5 class="card-title">{{ nft.name }}</h5>
              <p class="card-text">{{ nft.description }}</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import MintFormComponent from "@/components/MintForm.vue";
  import { mapGetters } from "vuex";
  import { create } from 'ipfs-http-client';
  import { apiService } from "@/common/api.service.js";

  export default {
    name: "Mint",

    data() {
      return {
        nfts: [],
        treasureNft: null,
        ipfs: null,
      }
    },

    created() {
      /*
        Create TreasureNFT contract instance.
      */

      let Interface = require("../../../smart-contracts/artifacts/contracts/TreasureNFT.sol/TreasureNFT.json");
      let Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      this.treasureNft = new this.web3.eth.Contract(Interface.abi, Address);
      this.ipfs = create('http://192.168.1.142:5001/');
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    components: {
      MintFormComponent,
    },

    methods: {
      async handleUri() {
        const index = await this.treasureNft.methods.balanceOf(this.wallet.address).call();

        for (let i = 0; i < index; i ++) {
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
      },
    }
  };
</script>

<style scoped>
</style>
