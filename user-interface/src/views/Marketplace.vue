<template>
  <div class="marketplace">
    <div class="container mt-3">
         <!-- Title -->
         <div class="text-center fw-bold fs-32px">
           <p>Marketplace</p>
         </div>

         <!-- Mint -->
         <div class="text-center my-4">
           <button class="btn btn-primary"
                   type="submit"
                   v-html="btnMsg"
                   @click="handleSell">
           </button>
         </div>

         <!-- NFTs -->
         <div class="row justify-content-start mt-4"
              v-if="nfts.length > 0">
              <div class="col-12 col-md-6 col-lg-4 col-xxl-3"
                   v-for="(nft, index) in nfts"
                   :key="index">
                   <!-- Card -->
                   <!-- <router-link :to="{ name: 'auction', params: { slug: auction.slug } }"> -->
                     <div class="card card-auction position-relative text-card-auction mb-4 mx-auto"
                          style="width: 18rem; height: 21rem;">
                          <div class="card-body text-center">
                            <!-- Card title -->
                            <p class="text-truncate fw-bold fs-24px mb-2">{{ nft.name }}</p>

                            <!-- Card image -->
                            <div class="card-img-wrap-auction">
                              <img alt="product image"
                                   class="card-img-auction"
                                   :src="nft.image">
                            </div>

                            <!-- Card body -->
                            <p class="fs-20px mt-3 mb-1">{{ nft.price }}</p>
                          </div>

                          <!-- Card footer -->
                          <div class="position-absolute bottom-0 start-50 translate-middle-x text-center"
                               style="width: 90%">
                               <hr class="mb-1">
                               <p class="text-muted fs-14px mb-1">{{ nft.shortAddr }}</p>
                          </div>
                     </div>
                   <!-- </router-link> -->
              </div> <!-- Col -->
         </div> <!-- Auctions -->

         <!-- No live auctions -->
         <div class="text-center mt-5"
              v-if="!loadingNfts && nfts.length === 0">
              <p class="fs-20px fw-blod text-muted">We are sorry but there are no NFT in sale at the moment...</p>
         </div>

         <!-- Pagination -->
         <div :class="{'position-absolute top-50 start-50 translate-middle': firstLoading,
                       'mb-5 mt-2 text-center': !firstLoading}">
           <div v-show="loadingNfts">
             <div class="spinner-grow text-violet"
                  role="status"
                  style="width: 3rem; height: 3rem;">
             </div>
           </div>
         </div>
    </div>
  </div>
</template>

<script>
  import { apiService } from "@/common/api.service.js";
  import { create } from 'ipfs-http-client';
  import { mapGetters } from "vuex";

  export default {
    name: "Marketplace",

    data() {
      return {
        treasureNft: null,
        merchant: null,
        ipfs: null,
        nfts: [],
        loadingNfts: true,
        firstLoading: true,
        approved: false,
        btnMsg: "Approve",
      }
    },

    async created() {
      /*
        Create TreasureNFT contract instance.
      */

      let treasureNftInterface = require("../../../smart-contracts/artifacts/contracts/TreasureNFT.sol/TreasureNFT.json");
      let treasureNftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      this.treasureNft = new this.web3.eth.Contract(treasureNftInterface.abi, treasureNftAddress);

      let merchantInterface = require("../../../smart-contracts/artifacts/contracts/Merchant.sol/Merchant.json");
      let merchantAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
      this.merchant = new this.web3.eth.Contract(merchantInterface.abi, merchantAddress);

      this.ipfs = create('http://192.168.1.142:5001/');

      const receipt = await this.treasureNft.methods.isApprovedForAll(this.wallet.address, this.merchant._address).call();
      if (receipt == true) {
        console.log("Already approved");
        this.approved = true;
        this.btnMsg = "Sell";
      } else {
        console.log("Not approved");
        this.approved = false;
        this.btnMsg = "Approve";
      }

      this.getNfts();
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      getShortAddress(address) {
        const addr = address.toString();
        const str1 = String(addr).slice(0, 6);
        const str2 = String(addr).slice(addr.length - 4, addr.length);
        return `${str1}...${str2}`;
      },

      async getNfts() {
        this.loadingNfts = true;
        let nftsIndex = 0;
        const sellers = await this.merchant.methods.totalSellers().call();

        for (let i = 0; i < sellers; i++) {
          let sellerAddress = await this.merchant.methods.sellerByIndex(i.toString()).call();
          let sellerSales = await this.merchant.methods.salesOf(sellerAddress).call();

          for (let j = 0; j < sellerSales; j++) {
            let tokenSale = await this.merchant.methods.saleOfOwnerByIndex(sellerAddress, j.toString()).call();
            this.nfts.push({
              tokenId: tokenSale.tokenId,
              price: this.web3.utils.fromWei(tokenSale.price),
              shortAddr: this.getShortAddress(sellerAddress),
            });
            let tokenUri = await this.treasureNft.methods.tokenURI(tokenSale.tokenId.toString()).call();

            await apiService(tokenUri)
              .then(metadata => {
                this.nfts[nftsIndex].name = metadata.name;
                this.nfts[nftsIndex].description = metadata.description;
                this.nfts[nftsIndex].image = metadata.image;
              })
              .catch(error => {
                console.error(error);
              });

            nftsIndex++;
          }
        }
        if (this.firstLoading) {
          this.firstLoading = false;
        }
        this.loadingNfts = false;
      },

      async approve() {
        this.treasureNft.methods.setApprovalForAll(this.merchant._address, true).send({from: this.wallet.address})
          .on("receipt", () => {
            console.log("Approved");
            this.approved = true;
            this.btnMsg = "Sell";
            this.$toasted.show(`Approved`, {icon: "ban"});
          })
          .on("error", (error, receipt) => {
            console.log("error + receipt");
            console.log(error);
            console.log(receipt);
            this.$toasted.show(`Error`, {icon: "ban"});
          });
      },

      async handleSell() {
        if (!this.approved) {
          await this.approve();
        } else {
          const index = 0;
          let tokenId = await this.treasureNft.methods.tokenOfOwnerByIndex(this.wallet.address, index).call();
          const price = 50;
          this.merchant.methods.sellItem(tokenId, this.web3.utils.toWei(price.toString())).send({from: this.wallet.address})
            .on("receipt", () => {
              console.log("Sale created");
              this.$toasted.show(`Sale created`, {icon: "ban"});
            })
            .on("error", (error, receipt) => {
              console.log("error + receipt");
              console.log(error);
              console.log(receipt);
              this.$toasted.show(`Error`, {icon: "ban"});
            });
        }
      },
    }
  };
</script>

<style scoped>
  .box {
    width: 22rem;
    text-align: center;
  }
</style>
