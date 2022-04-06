<template>
  <div class="profile-content">
    <div class="row g-4 px-1 px-md-5">

      <!-- Mint -->
      <div class="col-12 col-xl-5 col-xxl-4">
        <div class="box px-4 px-md-5 py-4">
          <div class="text-center">
            <h2 class="mb-2"><i class="fa-solid fa-gavel me-2"></i>Craft new items</h2>
            <h6 class="text-secondary">Mint ERC-721 NFTs via TreasureNFT smart contract</h6>
          </div>
          <MintComponent class="mt-4"
                         @nftMinted="onNftMinted($event)"/>
        </div>
      </div>

      <!-- User's NFTs -->
      <div class="col-12 col-xl-7 col-xxl-8">

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
  </div>
</template>

<script>
  import ListNftsComponent from "@/components/profile/modules/ListNfts.vue";
  import MintComponent from "@/components/profile/modules/Mint.vue";
  import NftsForSaleComponent from "@/components/profile/modules/NftsForSale.vue";

  export default {
    name: "ProfileContentComponent",

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
      ListNftsComponent,
      MintComponent,
      NftsForSaleComponent,
    },
  };
</script>

<style scoped>
  .profile-content {
    height: 100%;
  }
</style>
