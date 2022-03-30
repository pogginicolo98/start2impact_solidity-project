<template>
  <div class="profile">
      <div class="row justify-content-between mx-1 mx-md-5 mt-4">

        <!-- Mint -->
        <div class="col-12 col-xl-4 col-xxl-4 mb-4">
          <div class="box px-4 px-md-5 py-4">
            <div class="text-center">
              <h2 class="mb-2"><i class="fa-solid fa-gavel me-2"></i>Craft new items</h2>
              <!-- <h6 class="text-secondary">Mint your own NFTs</h6> -->
            </div>
            <MintComponent class="mt-4"
                               @nftMinted="onNftMinted($event)"/>
          </div>
        </div>

        <!-- User NFTs -->
        <div class="col-12 col-xl-8 col-xxl-8 mb-4">

          <!-- Available NFTs -->
          <div class="box px-4 px-md-5 pt-4 pb-2">
            <h2 class="text-center"><i class="fa-solid fa-vault me-2"></i>Your items available</h2>
            <ListNftsComponent :tokenId="tokenId"/>
          </div>

          <!-- NFTs for sale -->
          <div class="box px-4 px-md-5 pt-4 pb-2 mt-4">
            <h2 class="text-center"><i class="fa-solid fa-scale-balanced me-2"></i>Your items for sale</h2>
            <NftsForSaleComponent />
          </div>
        </div>

      </div>
  </div> <!-- Profile -->
</template>

<script>
  import ListNftsComponent from "@/components/profile/ListNfts.vue";
  import NftsForSaleComponent from "@/components/profile/NftsForSale.vue";
  import MintComponent from "@/components/profile/Mint.vue";

  export default {
    name: "Profile",

    data() {
      return {
        tokenId: null,
      }
    },

    methods: {
      async onNftMinted(event) {
        this.tokenId = event;
      },
    },

    components: {
      MintComponent,
      NftsForSaleComponent,
      ListNftsComponent,
    },
  };
</script>

<style scoped>
</style>
