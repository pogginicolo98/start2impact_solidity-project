<template>
  <div class="buy-form d-grid">
    <button class="btn btn-secondary"
            v-html="btnText"
            :class="{'btn-pending': isPending}"
            :disabled="isDisabled"
            @click="handleBuy">
    </button>
  </div>
</template>

<script>
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { mapGetters } from "vuex";

  export default {
    name: "BuyFormComponent",

    props: {
      tokenId: {
        type: String,
        required: true
      },
    },

    data() {
      return {
        btnText: "<i class='fa-solid fa-wallet me-2'></i>Buy",
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
          msg = "<i class='fa-solid fa-wallet me-2'></i>Buy";
        }
        this.btnText = msg;
      },

      async getNftSale() {
        let sellers = await this.merchant.methods.totalSellers().call();
        for (let sellerIndex = 0; sellerIndex < sellers; sellerIndex++) {
          let sellerAddress = await this.merchant.methods.sellerByIndex(sellerIndex).call();
          let sellerSales = await this.merchant.methods.salesOf(sellerAddress).call();
          for (let saleIndex = 0; saleIndex < sellerSales; saleIndex++) {
            let sale = await this.merchant.methods.saleOfOwnerByIndex(sellerAddress, saleIndex).call();
            if (sale.tokenId == this.tokenId) {
              return {
                seller: sellerAddress,
                index: saleIndex
              };
            }
          }
        }
        return null;
      },

      async handleBuy() {
        this.isDisabled = true;
        let owner = await this.treasureNFT.methods.ownerOf(this.tokenId).call();
        if (owner.toLowerCase() == this.merchant._address.toLowerCase()) {
          let sale = await this.getNftSale();
          if (sale != null) {
            this.merchant.methods.buyItemOfOwnerByIndex(sale.seller, sale.index).send({from: this.wallet.address})
              .on("transactionHash", () => {
                this.isDisabled = false;
                this.setLoadingStatus("enable");
              })
              .then(receipt => {
                if (receipt.events.ItemSold.returnValues.tokenId == this.tokenId) {
                  this.$toasted.show(`Bought successfully`, {icon: "check"});
                  this.$emit('saleExecuted');
                } else {
                  this.$toasted.show(`Transaction error`, {icon: "ban"});
                }
                this.setLoadingStatus("disable");
              })
              .catch(error => {
                console.error("error occurred executing Merchant method 'buyItemOfOwnerByIndex'");
                console.log(error);
                this.isDisabled = false;
                this.setLoadingStatus("disable");
                this.$toasted.show(`Transaction error`, {icon: "ban"});
              });
          } else {
            console.log("error");
            this.isDisabled = false;
          }
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
