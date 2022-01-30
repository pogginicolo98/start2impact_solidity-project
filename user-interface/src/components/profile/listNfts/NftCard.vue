<template>
  <div class="nft-card">

    <!-- Placeholder -->
    <template v-if="isLoading">
      <div class="card card-nft">
        <div class="card-body p-0">
          <div class="card-nft-img-wrap">
            <span class="placeholder col-12 card-nft-img"></span>
          </div>
          <div class="placeholder-glow text-center mx-3 mt-3">
            <span class="placeholder col-5"></span>
          </div>
        </div>
      </div>
    </template>

    <!-- Loaded NFT -->
    <template v-else>
      <div class="card card-nft">
        <div class="card-body p-0">
          <div class="card-nft-img-wrap">
            <img alt="product image"
                 class="card-nft-img"
                 v-if="nft.image"
                 :src="nft.image">
            <i class="fa-regular fa-image card-nft-icon position-absolute top-50 start-50 translate-middle"
               v-else>
            </i>
          </div>
          <p class="text-truncate text-center fw-bold mx-3 mt-3">{{ nft.name }}</p>
        </div>
      </div>
    </template>

  </div> <!-- NFT card -->
</template>

<script>
  export default {
    name: "NftCardComponent",

    props: {
      isLoading: {
        type: Boolean,
        required: true,
      },
      nft: {
        type: Object,
        required: false,
      },
    },
  }
</script>

<style scoped>
  .card-nft {
    width: 14rem;
    height: 17.5rem;
    border-radius: 12px;
    border: 1px solid hsla(0,0%,100%,.2);
    background-color: #2e2d2c;
    overflow: hidden;
    transition: transform 0.2s ease;
  }

  .card-nft:hover {
    box-shadow: 0px 0px 7px 1px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .card-nft-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
  }

  .card-nft-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: auto;
  }

  .card-nft-icon {
    font-size: 64px;
    color: #fff;
  }
</style>
