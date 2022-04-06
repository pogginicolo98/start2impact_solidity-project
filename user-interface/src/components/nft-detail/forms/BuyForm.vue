<template>
  <div class="buy-form">

    <!-- Buy message -->
    <div class="mb-4 text-center" v-if="isApproved">
      <h4>Do you want to buy this item at the price of {{ price }} $WISP?</h4>
      <p class="text-secondary">The amount will be deducted from your account and the NFT will be transferred to your wallet</p>
    </div>

    <!-- Approval message -->
    <div class="mb-4 text-center" v-else>
      <h4>Sign the contract with the merchant</h4>
      <p class="text-secondary">
        Approve the
        <a class="link-info"
           target="_blank"
           :href="contractLink"
           >WispToken
        </a>
        contract in order to buy the NFT
      </p>
    </div>

    <!-- Approve/Buy button -->
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
  import { mapGetters } from "vuex";
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import wispTokenMixin from "@/mixins/WispToken";

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
        btnTextApprove: "<i class='fa-solid fa-scroll me-2'></i>Approve contract",
        btnTextApproving: "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Approving",
        btnTextBuy: "<i class='fa-solid fa-sack-dollar me-2'></i>Purchase item",
        btnTextBuying: "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Purchasing",
        btnText: null,
        isPending: false,
        isDisabled: false,
        isApproved: false,
      }
    },

    created() {
      this.btnText = this.btnTextApprove;
      setTimeout(async () => {
        try {
          let bigNumber = this.web3.utils.BN;
          let approvedAmount = new bigNumber(await this.wispToken.methods.allowance(this.wallet.address, this.merchant._address).call());
          let price = new bigNumber(this.web3.utils.toWei(this.price));

          if (approvedAmount.gte(price)) {
            this.isApproved = true;
            this.btnText = this.btnTextBuy;
          } else {
            this.isApproved = false;
          }
        } catch (error) {
          console.log("WispToken contract: error while executing method 'allowance'");
          console.log(error);
          this.isApproved = false;
          this.$toasted.show(`WispToken allowance error`, {icon: "skull-crossbones"});
        }
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      contractLink() {
        return `https://ropsten.etherscan.io/address/${this.wispToken._address}`;
      },
    },

    methods: {
      setLoadingStatus(payload) {
        if (payload == "enable") {
          this.isPending = true;
          this.btnText = this.isApproved == true
            ? this.btnTextBuying
            : this.btnTextApproving;
        } else if (payload == "disable") {
          this.isPending = false;
          this.btnText = this.isApproved == true
            ? this.btnTextBuy
            : this.btnTextApprove;
        }
      },

      async approve() {
        this.isDisabled = true;
        let bigNumber = this.web3.utils.BN;
        let amount = new bigNumber("2").pow(new bigNumber("256")).sub(new bigNumber("1"));

        await this.wispToken.methods.approve(this.merchant._address, amount).send({from: this.wallet.address})
          .on("transactionHash", () => {
            this.isDisabled = false;
            this.setLoadingStatus("enable");
          })
          .then(receipt => {
            if (receipt.events.Approval.returnValues.owner.toLowerCase() == this.wallet.address.toLowerCase()) {
              this.isApproved = true;
              this.$toasted.show(`Contract approved`, {icon: "scroll"});
            } else {
              this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
            }
            this.setLoadingStatus("disable");
          })
          .catch(error => {
            console.error("error occurred executing WispToken method 'approve'");
            console.log(error);
            this.isDisabled = false;
            this.isApproved = false;
            this.setLoadingStatus("disable");
            this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
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
              await this.merchant.methods.buyItemOfOwnerByIndex(sale.seller, sale.index).send({from: this.wallet.address})
                .on("transactionHash", () => {
                  this.isDisabled = false;
                  this.setLoadingStatus("enable");
                })
                .then(receipt => {
                  if (receipt.events.ItemSold.returnValues.tokenId == this.tokenId) {
                    this.$toasted.show(`Item purchased`, {icon: "sack-dollar"});
                    this.$emit('saleExecuted');
                  } else {
                    this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
                  }
                  this.setLoadingStatus("disable");
                })
                .catch(error => {
                  console.error("error occurred executing Merchant method 'buyItemOfOwnerByIndex'");
                  console.log(error);
                  this.isDisabled = false;
                  this.setLoadingStatus("disable");
                  this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
                });
            } else {
              console.log("error");
              this.isDisabled = false;
            }
          }
        } else {
          await this.approve();
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
