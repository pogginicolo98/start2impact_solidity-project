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
        btnText: "<i class='fa-solid fa-scale-balanced me-2'></i>Cancel",
        isPending: false,
        isDisabled: false,
      }
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),
    },

    methods: {
      setLoadingStatus(payload) {
        // Set the button text and pending status

        let msg = "";
        if (payload == "enable") {
          this.isPending = true;
          msg = "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Pending";
        } else if (payload == "disable") {
          this.isPending = false;
          msg = "<i class='fa-solid fa-scale-balanced me-2'></i>Cancel";
        }
        this.btnText = msg;
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
                this.$toasted.show(`Sale canceled`, {icon: "check"});
                this.$emit('saleCanceled');
              } else {
                this.$toasted.show(`Transaction error`, {icon: "ban"});
              }
              this.setLoadingStatus("disable");
            })
            .catch(error => {
              console.error("error occurred executing Merchant method 'cancelSaleByIndex'");
              console.log(error);
              this.isDisabled = false;
              this.setLoadingStatus("disable");
              this.$toasted.show(`Transaction error`, {icon: "ban"});
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
