<template>
  <div class="title">
    <div class="row">

      <!-- Buttons area -->
      <div class="col-12 text-end mb-4 mb-lg-2">
        <VueCustomTooltip label="Refresh metadata" position="is-bottom">
          <button type="button" class="btn btn-outline-secondary" @click="refresh">
            <i class="fa-solid fa-arrow-rotate-right"></i>
          </button>
        </VueCustomTooltip>
        <VueCustomTooltip label="Share" position="is-bottom">
          <button type="button" class="btn btn-outline-secondary ms-1" @click="copyToClipboard">
            <i class="fa-solid fa-share-nodes"></i>
          </button>
        </VueCustomTooltip>
      </div>

      <!-- Name area -->
      <div class="col-12">

        <!-- placeholder -->
        <div v-if="isLoading">
          <h2 class="placeholder-glow">
            <span class="placeholder col-2"></span>
          </h2>
          <p class="placeholder-glow">
            <span class="placeholder col-3"></span>
          </p>
        </div>

        <!-- Name -->
        <div v-else>
          <h2 class="text-truncate">{{ nft.metadata.name }}</h2>
          <p class="text-secondary">
            Owned by
            <a class="link-info"
               target="_blank"
               :href="getOwnerLink"
               >{{ getOwner }}
            </a>
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "TitleComponent",

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

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      getOwner() {
        const address = this.nft.owner.toString();
        if (this.wallet.address.toLowerCase() == address.toLowerCase()) {
          return "you";
        } else {
          const str1 = String(address).slice(0, 6);
          const str2 = String(address).slice(address.length - 4, address.length);
          return `${str1}...${str2}`;
        }
      },

      getOwnerLink() {
        return `https://ropsten.etherscan.io/address/${this.nft.owner}`;
      },
    },

    methods: {
      refresh() {
        this.$emit('refresh');
      },

      copyToClipboard() {
        this.$clipboard(window.location.href);
        this.$toasted.show(`Link copied`, {icon: "check"});
      },
    },
  }
</script>

<style scoped>
</style>
