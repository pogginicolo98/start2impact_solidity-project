<template>
  <div class="info">
    <div class="accordion">

      <!-- Description -->
      <div class="accordion-item">
        <h2 class="accordion-header"
            id="description-heading">
            <button aria-controls="description-collapse"
                    aria-expanded="true"
                    class="accordion-button fw-bold"
                    data-bs-target="#description-collapse"
                    data-bs-toggle="collapse"
                    >Description
            </button>
        </h2>
        <div aria-labelledby="description-heading"
             class="accordion-collapse show"
             id="description-collapse">
             <div class="accordion-body">
               <p class="placeholder-glow"
                  v-if="isLoading">
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-9"></span>
                  <span class="placeholder col-8"></span>
               </p>
               <div v-else>
                 <p class="text-secondary">
                   Created by
                   <a class="link-info"
                      target="_blank"
                      :href="getCreatorLink"
                      >{{ getCreator }}
                   </a>
                 </p>
                 <p class="text-break mb-0"
                    v-if="nft.metadata.description"
                    >{{ nft.metadata.description }}
                 </p>
                 <p class="text-muted mb-0"
                    v-else
                    >No description available
                 </p>
               </div>
             </div>
        </div>
      </div>

      <!-- Details -->
      <div class="accordion-item">
        <h2 class="accordion-header"
            id="detail-heading">
            <button aria-controls="detail-collapse"
                    aria-expanded="false"
                    class="accordion-button collapsed fw-bold"
                    data-bs-target="#detail-collapse"
                    data-bs-toggle="collapse"
                    >Details
            </button>
        </h2>
        <div aria-labelledby="detail-heading"
             class="accordion-collapse collapse"
             id="detail-collapse">
             <div class="accordion-body">

               <!-- Contract address -->
               <div class="row">
                 <div class="col-4">
                   <p>Contract Address</p>
                 </div>
                 <div class="col-8 text-end">
                   <a class="link-info"
                      target="_blank"
                      :href="getLink"
                      >{{ getContractAddr }}
                   </a>
                 </div>
               </div>

               <!-- Token ID -->
               <div class="row">
                 <div class="col-4">
                   <p>Token ID</p>
                 </div>
                 <div class="col-8 text-end text-secondary">
                   <VueCustomTooltip position="is-left"
                                     :label="tokenIdLabel">
                                     <span class="btn-copy"
                                           @click="copyToClipboard(nft.tokenId)"
                                           >{{ getTokenId }}
                                     </span>
                   </VueCustomTooltip>
                 </div>
               </div>

               <!-- Token standard -->
               <div class="row">
                 <div class="col-4">
                   <p class="mb-0">Token Standard</p>
                 </div>
                 <div class="col-8 text-end text-secondary">
                   <p class="mb-0">ERC-721</p>
                 </div>
               </div>

             </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import treasureNFTMixin from "@/mixins/TreasureNFT";

  export default {
    name: "InfoComponent",

    props: {
      isLoading: {
        type: Boolean,
        required: true
      },
      nft: {
        type: Object,
        required: false
      },
    },

    data() {
      return {
        tokenIdLabel: "Copy",
      }
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      getContractAddr() {
        const address = this.treasureNFT._address.toString();
        const str1 = String(address).slice(0, 6);
        const str2 = String(address).slice(address.length - 4, address.length);
        return `${str1}...${str2}`;
      },

      getTokenId() {
        const tokenId = this.nft.tokenId;
        if (tokenId.length > 8) {
          const str = String(tokenId).slice(0, 8);
          return `${str}...`;
        }
        return tokenId;
      },

      getLink() {
        return `https://ropsten.etherscan.io/address/${this.treasureNFT._address}`;
      },

      getCreator() {
        const address = this.nft.metadata.creator.toString();
        if (this.wallet.address.toLowerCase() == address.toLowerCase()) {
          return "you";
        } else {
          const str1 = String(address).slice(0, 6);
          const str2 = String(address).slice(address.length - 4, address.length);
          return `${str1}...${str2}`;
        }
      },

      getCreatorLink() {
        return `https://ropsten.etherscan.io/address/${this.nft.metadata.creator}`;
      },
    },

    methods: {
      copyToClipboard(payload) {
        this.$clipboard(payload);
        if (this.tokenIdLabel === "Copy") {
          this.tokenIdLabel = "Copied!";
          setTimeout(() => {
            this.tokenIdLabel = "Copy";
          }, 5000);
        }
      },
    },

    mixins: [
      treasureNFTMixin,
    ],
  }
</script>

<style scoped>
  .accordion-item {
    overflow: hidden;
  }

  .accordion-body {
    background-color: #2c2c2c;
  }

  .btn-copy {
    cursor: pointer;
    width: auto;
  }
</style>
