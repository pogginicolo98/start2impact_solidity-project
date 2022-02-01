<template>
  <div class="nft-details">
    <div class="container mt-3">
      <div class="row">

        <div class="col-5 ps-4 pe-3">
          <div class="card card-nft">
            <div class="card-body p-0">
              <div class="card-nft-img-wrap">
                <img alt="product image"
                     class="card-nft-img"
                     v-if="metadata.image"
                     :src="metadata.image">
                <i class="fa-regular fa-image card-nft-icon position-absolute top-50 start-50 translate-middle"
                   v-else>
                </i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-7 pe-4">
          <div class="row">
            <div class="col-12 text-end">

              <div class="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary">Left</button>
                <button type="button" class="btn btn-outline-primary">Middle</button>
                <button type="button" class="btn btn-outline-primary">Right</button>
              </div>
            </div>

            <div class="col-12">
              <h2>{{ metadata.name }}</h2>
              <p class="text-muted">Owned by <a href="#">OWNER</a></p>
            </div>

            <div class="col-12">
              <div class="card card-nft mt-5" style="width: 100%;">
                <div class="card-body p-4">
                  <p class="text-muted">Selling price</p>
                  <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="$WISP">
                    <img src="../assets/token-logo-32x32.png" alt="">
                  </a>
                  <span class="fw-bold fs-3 align-middle" > 1200.6</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="col-5 ps-4 pe-3 my-3">
          <div class="accordion" id="accordionPanelsStayOpenExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                  Description
                </button>
              </h2>
              <div id="panelsStayOpen-collapseOne" class="accordion-collapse show" aria-labelledby="panelsStayOpen-headingOne">
                <div class="accordion-body">
                  {{ metadata.description }}
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                  Details
                </button>
              </h2>
              <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                <div class="accordion-body">
                  Some details
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div> <!-- NFT details -->
</template>

<script>
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { apiService } from "@/common/api.service.js";
  
  export default {
    name: "NftDetails",

    props: {
      tokenId: {
        type: String,
        required: true,
      },
    },

    data() {
      return {
        isLoading: true,
        metadata: null,
      };
    },

    created() {
      setTimeout(async () => {
        await this.getNft();
      }, 500);
    },

    methods: {
      async getNft() {
        let tokenUri = await this.treasureNFT.methods.tokenURI(this.tokenId).call();
        await apiService(tokenUri)
          .then(response => {
            this.metadata = response;
          })
          .catch(error => {
            console.log(error);
          });
        this.isLoading = false;
      },
    },

    mixins: [
      treasureNFTMixin,
    ],
  };
</script>

<style scoped>
  .box {
    border-radius: 12px;
    background-color: #2c2c2c;
  }

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
    font-size: 64px;
    color: #fff;
  }

  .accordion-item {
    overflow: hidden;
  }

  .accordion-body {
    background-color: #2c2c2c;
  }
</style>
