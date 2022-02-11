<template>
  <div class="profile">
      <div class="row justify-content-between mx-1 mx-md-5 mt-4">

        <!-- Mint -->
        <div class="col-12 col-xl-4 col-xxl-4 mb-4">
          <div class="box px-4 px-md-5 py-4">
            <div class="text-center">
              <h2 class="mb-2">Mint</h2>
              <h6>Create a new Treasure ($TRS) NFT</h6>
            </div>
            <MintComponent class="mt-4"
                               @nftMinted="onNftMinted($event)"/>
          </div>
        </div>

        <!-- User NFTs -->
        <div class="col-12 col-xl-8 col-xxl-8 mb-4">
          <div class="box px-4 px-md-5 pt-4 pb-2">
            <h2 class="text-center">Available Treasure NFTs</h2>
            <ListNftsComponent :tokenId="tokenId"/>
          </div>
        </div>
      </div>

  </div> <!-- Profile -->
</template>

<script>
  import ListNftsComponent from "@/components/profile/ListNfts.vue";
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
      ListNftsComponent,
    },
  };
</script>

<style scoped>
</style>
