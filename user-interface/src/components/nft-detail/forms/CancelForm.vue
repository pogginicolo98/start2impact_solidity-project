<template>
  <div class="cancel-form d-grid">
    <button class="btn btn-danger"
            v-html="btnText"
            :class="{'btn-pending': isPending}"
            :disabled="isDisabled"
            @click="handleCancel">
    </button>
  </div>
</template>

<script>
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { mapGetters } from "vuex";

  export default {
    name: "CancelFormComponent",

    props: {
      tokenId: {
        type: String,
        required: true
      },
    },

    data() {
      return {
        btnTextDefault: "<i class='fa-solid fa-handshake-slash me-2'></i>Take back",
        btnTextLoading: "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Pending",
        btnText: null,
        isPending: false,
        isDisabled: false,
      }
    },

    created() {
      this.btnText = this.btnTextDefault;
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      setLoadingStatus(payload) {
        if (payload == "enable") {
          this.isPending = true;
          this.btnText = this.btnTextLoading;
        } else if (payload == "disable") {
          this.isPending = false;
          this.btnText = this.btnTextDefault;
        }
      },

      async handleCancel() {
        let index = null;
        this.isDisabled = true;
        const owner = await this.treasureNFT.methods.ownerOf(this.tokenId).call();

        if (owner.toLowerCase() == this.merchant._address.toLowerCase()) {
          const sales = await this.merchant.methods.salesOf(this.wallet.address).call();

          for (let i = 0; i < sales; i ++) {
            let sale = await this.merchant.methods.saleOfOwnerByIndex(this.wallet.address, i).call();

            if (sale.tokenId == this.tokenId) {
              index = i;
              break;
            }
          }
        }

        if (index != null) {
          this.merchant.methods.cancelSaleByIndex(index).send({from: this.wallet.address})
            .on("transactionHash", () => {
              this.isDisabled = false;
              this.setLoadingStatus("enable");
            })
            .then(receipt => {
              if (receipt.events.SaleCanceled.returnValues.tokenId == this.tokenId) {
                this.$toasted.show(`Sale canceled`, {icon: "scale-balanced"});
                this.$emit('saleCanceled');
              } else {
                this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
              }
              this.setLoadingStatus("disable");
            })
            .catch(error => {
              console.error("error occurred executing Merchant method 'cancelSaleByIndex'");
              console.log(error);
              this.isDisabled = false;
              this.setLoadingStatus("disable");
              this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
            });
        }
      },
    },

    mixins: [
      merchantMixin,
      treasureNFTMixin,
    ],
  }
</script>

<style scoped>
</style>
