<template>
  <div class="buy-form">
    <h4 class="text-center">Do you want to buy this NFT for {{ price }} $WISP?</h4>
    <p class="text-muted text-center mb-4">If you don't have enough funds, the transaction will fail and you will lose your gas fees!</p>
    <span class="d-grid btn-wrap"
          :class="{'btn-wrap-disabled': isDisabled,
                   'btn-wrap-pending': isPending}">
          <button class="btn btn-primary px-4 py-2"
                  type="submit"
                  v-html="btnText"
                  :class="{'btn-pending': isPending}"
                  :disabled="isDisabled"
                  @click="handleBuy">
          </button>
    </span>
  </div>
</template>

<script>
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import wispTokenMixin from "@/mixins/WispToken";
  import { mapGetters } from "vuex";

  export default {
    name: "BuyFormComponent",

    props: {
      tokenId: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        btnText: "Approve",
        isPending: false,
        isDisabled: false,
        isApproved: false,
      }
    },

    created() {
      setTimeout(async () => {
        let bigNumber = this.web3.utils.BN;
        let approvedAmount = new bigNumber(await this.wispToken.methods.allowance(this.wallet.address, this.merchant._address).call());
        let price = new bigNumber(this.web3.utils.toWei(this.price));
        if (approvedAmount.gte(price)) {
          this.isApproved = true;
          this.btnText = "Buy";
        } else {
          this.isApproved = false;
        }
      }, 500);
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
          msg = this.isApproved == true
            ? "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Pending"
            : "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Approving";
        } else if (payload == "disable") {
          this.isPending = false;
          msg = this.isApproved == true
            ? "Buy"
            : "Approve";
        }
        this.btnText = msg;
      },

      approve() {
        this.isDisabled = true;
        let bigNumber = this.web3.utils.BN;
        let amount = new bigNumber("2").pow(new bigNumber("256")).sub(new bigNumber("1"));
        this.wispToken.methods.approve(this.merchant._address, amount).send({from: this.wallet.address})
          .on("transactionHash", () => {
            this.isDisabled = false;
            this.setLoadingStatus("enable");
          })
          .then(receipt => {
            if (receipt.events.Approval.returnValues.owner.toLowerCase() == this.wallet.address.toLowerCase()) {
              this.isApproved = true;
              this.$toasted.show(`Approved`, {icon: "check"});
            } else {
              this.$toasted.show(`Approval error`, {icon: "ban"});
            }
            this.setLoadingStatus("disable");
          })
          .catch(error => {
            console.error("error occurred executing WispToken method 'approve'");
            console.log(error);
            this.isDisabled = false;
            this.isApproved = false;
            this.setLoadingStatus("disable");
            this.$toasted.show(`Approval error`, {icon: "ban"});
          });
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
        if (this.isApproved) {
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
        } else {
          this.approve();
        }
      },
    },

    mixins: [
      merchantMixin,
      treasureNFTMixin,
      wispTokenMixin,
    ],
  }
</script>

<style scoped>
</style>
