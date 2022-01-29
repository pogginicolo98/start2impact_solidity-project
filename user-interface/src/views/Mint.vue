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
            <MintFormComponent class="mt-4"
                               @nftMinted="onNftMinted($event)"/>
          </div>
        </div>

        <!-- User NFTs -->
        <div class="col-7 box px-5 py-4">
          <h2 class="text-center">Available NFTs</h2>
          <ListNftsComponent :tokenId="tokenId"/>
        </div>
      </div>
  </div>
</template>

<script>
  import ListNftsComponent from "@/components/mint/ListNfts.vue";
  import MintFormComponent from "@/components/mint/MintForm.vue";

  export default {
    name: "Mint",

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
      MintFormComponent,
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
