<template>
  <div class="marketplace">
    <div class="container mt-3"
         v-else>
         <!-- Title -->
         <div class="text-center fw-bold fs-32px">
           <p>Marketplace</p>
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
           <div v-show="loadingAuctions">
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
  // @ is an alias to /src

  export default {
    name: "Marketplace",
    methods: {
      getShortAddress(address) {
        const shortAddress = address.toString();
        const str1 = String(shortAddress).slice(0, 6);
        const str2 = String(shortAddress).slice(shortAddress.length - 4, shortAddress.length);
        return `${str1}...${str2}`;
      },
      async getUri() {
        const merchantBalance = await treasureNFT.methods.balanceOf(merchant.address);
        for (let i = 0; i < merchantBalance; i ++) {
          let tokenId = await this.treasureNft.methods.tokenOfOwnerByIndex(merchant.address, i).call();
          let tokenUri = await this.treasureNft.methods.tokenURI(tokenId).call();
          let tokenSale = await merchant.methods.saleOf(token);
          await apiService(tokenUri)
            .then(response => {
              this.nfts.push(response);
            })
            .catch(error => {
              console.log(error);
            });

        }

        const index = await this.treasureNft.methods.balanceOf(this.wallet.address).call();


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
