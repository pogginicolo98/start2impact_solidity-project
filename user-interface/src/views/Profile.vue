<template>
  <div class="profile">
      <div class="row justify-content-between m-5">

        <!-- Mint -->
        <div class="col-4">
          <div class="box px-5 pt-4 pb-5">
            <div class="text-center">
              <h2 class="mb-2">Mint</h2>
              <h6>Create a new Treasure ($TRS) NFT</h6>
            </div>
            <MintComponent class="mt-4"
                               @nftMinted="onNftMinted($event)"/>
          </div>
        </div>

        <!-- User NFTs -->
        <div class="col-7">
          <div class="box px-5 pt-4 pb-5">
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
      };
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
  .box {
    border-radius: 12px;
    background-color: #2c2c2c;
  }
</style>
