<template>
  <div class="image-details">
    <div class="card card-nft">
      <div class="card-body p-0">
        <div class="card-nft-img-wrap">

          <!-- Image placeholder -->
          <span class="placeholder col-12 card-nft-img"
                v-if="isLoading">
          </span>

          <!-- Image -->
          <img alt="nft image"
               class="card-nft-img"
               v-else-if="nft.metadata.image"
               :src="nft.metadata.image">

          <!-- Blank image -->
          <i class="fa-regular fa-image card-nft-icon position-absolute top-50 start-50 translate-middle"
             v-else>
          </i>

        </div>
      </div>
    </div>
  </div> <!-- Image details -->
</template>

<script>
  export default {
    name: "ImageDetailsComponent",

    props: {
      isLoading: {
        type: Boolean,
        required: true
      },
      nft: {
        type: Object,
        required: false
      }
    },
  }
</script>

<style scoped>
  .card-nft {
    width: 100%;
    height: auto;
    border-radius: 12px;
    border: 1px solid hsla(0,0%,100%,.2);
    background-color: #2e2d2c;
    overflow: hidden;
    transition: transform 0.2s ease;
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
    font-size: 128px;
    color: #fff;
  }
</style>
