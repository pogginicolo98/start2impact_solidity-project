<template>
  <div class="sell-form">

    <!-- Sell message -->
    <div class="mb-4 text-center"
         v-if="isApproved">
         <h4>Establish the selling price</h4>
         <p class="text-secondary">Set the amount of $WISP tokens your NFT will be sold for</p>
    </div>

    <!-- Approval message -->
    <div class="mb-4 text-center"
         v-else>
         <h4>Sign the contract with the merchant</h4>
         <p class="text-secondary">
           Approve the
           <a class="link-info"
              target="_blank"
              :href="getLink"
              >TreasureNFT
           </a>
           contract in order to buy the NFTcontract to allow the sale of your NFT
         </p>
    </div>

    <!-- Form -->
    <form class="needs-validation"
          novalidate
          @submit.prevent="handleSell">

          <!-- Input price -->
          <div class="input-wrap"
               v-if="isApproved"
               :class="{'focusOff': !price.isFocus,
                        'focusOn': price.isFocus}">
               <label class="position-relative d-block">
                 <img alt="$WISP"
                      class="position-absolute top-50 start-0 translate-middle ms-4"
                      src="@/assets/images/token-logo-24x24.png">
                 <input aria-describedby="priceFormFeedback"
                        class="form-control input-field"
                        id="priceInput"
                        placeholder="Price in $WISP"
                        style="padding-left: 42px;"
                        type="number"
                        v-model="price.value"
                        :class="{'is-invalid': !isValid}"
                        @blur="setFocus(false)"
                        @focus="setFocus(true)">
               </label>
          </div>
          <div class="invalid-feedback d-block mt-2"
               id="priceFormFeedback"
               v-if="isApproved">
               <ul>
                 <li v-for="(error, index) in price.errors"
                     :key="index"
                     >{{ error }}
                 </li>
               </ul>
          </div>

          <!-- Approve/Sell button -->
          <span class="d-grid btn-wrap"
                :class="{'btn-wrap-disabled': isDisabled,
                         'btn-wrap-pending': isPending}">
                <button class="btn btn-primary px-4 py-2"
                        type="submit"
                        v-html="btnText"
                        :class="{'btn-pending': isPending}"
                        :disabled="isDisabled">
                </button>
          </span>

    </form>

  </div>
</template>

<script>
  import { countDecimalPlaces } from "@/common/utility.js";
  import merchantMixin from "@/mixins/Merchant";
  import treasureNFTMixin from "@/mixins/TreasureNFT";
  import { mapGetters } from "vuex";

  export default {
    name: "SellFormComponent",

    props: {
      tokenId: {
        type: String,
        required: true
      },
    },

    data() {
      return {
        btnTextApprove: "<i class='fa-solid fa-scroll me-2'></i>Approve contract",
        btnTextApproving: "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Approving",
        btnTextSell: "<i class='fa-solid fa-hand-holding-hand me-2'></i>Give to the merchant",
        btnTextSelling: "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Selling",
        btnText: null,
        isPending: false,
        isDisabled: false,
        isApproved: false,
        price: {
          isFocus: false,
          value: null,
          errors: []
        },
      }
    },

    created() {
      this.btnText = this.btnTextApprove;
      setTimeout(async () => {
        try {
          const contractApproved = await this.treasureNFT.methods.isApprovedForAll(this.wallet.address, this.merchant._address).call();
          if (contractApproved) {
            this.isApproved = true;
            this.btnText = this.btnTextSell;
          } else {
            this.isApproved = false;
          }
        } catch (error) {
          this.isApproved = false;
          this.logError("TreasureNFT allowance error", error);
        }
      }, 500);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      isValid() {
        return this.price.errors.length == 0
          ? true
          : false;
      },

      getLink() {
        return `https://ropsten.etherscan.io/address/${this.treasureNFT._address}`;
      },
    },

    methods: {
      setFocus(payload) {
        this.price.isFocus = payload;
      },

      setLoadingStatus(payload) {
        if (payload == "enable") {
          this.isPending = true;
          this.btnText = this.isApproved == true
            ? this.btnTextSelling
            : this.btnTextApproving;
        } else if (payload == "disable") {
          this.isPending = false;
          this.btnText = this.isApproved == true
            ? this.btnTextSell
            : this.btnTextApprove;
        }
      },

      validateForm() {
        /*
            Validation form fields.

            :fields
            - Price:
              1) 18 decimals maximum.
              2) Not null.
              3) Greather than 0.
              4) (2^256 -1)/10^18 maximum value.
        */

        let formValid = true;
        this.price.errors = [];
        let decimals = countDecimalPlaces(this.price.value)

        if (decimals > 18) {
          this.price.errors.push("Maximum 18 decimal places");
          formValid = false;
        }
        if (this.price.value == null) {
          this.price.errors.push("The price cannot be empty");
          formValid = false;
        }
        if (this.price.value <= 0) {
          this.price.errors.push("The price must be greater than zero");
          formValid = false;
        }
        if (this.price.value > (Math.pow(2, 256) - 1) / (Math.pow(10, 18))) {
          this.price.errors.push("The price exceeds the limit of the ERC-20 standard");
          formValid = false;
        }

        return formValid;
      },

      async approve() {
        this.isDisabled = true;
        await this.treasureNFT.methods.setApprovalForAll(this.merchant._address, true).send({from: this.wallet.address})
          .on("transactionHash", () => {
            this.isDisabled = false;
            this.setLoadingStatus("enable");
          })
          .then(receipt => {
            if (receipt.events.ApprovalForAll.returnValues.approved == true) {
              this.isApproved = true;
              this.$toasted.show(`Contract approved`, {icon: "scroll"});
            } else {
              this.logError("Transaction error", receipt);
            }
            this.setLoadingStatus("disable");
          })
          .catch(error => {
            this.isDisabled = false;
            this.isApproved = false;
            this.setLoadingStatus("disable");
            this.logError("Transaction error", error);
          });
      },

      async handleSell() {
        if (this.isApproved) {
          if (this.validateForm()) {
            const price = this.web3.utils.toWei(this.price.value);
            this.isDisabled = true;
            await this.merchant.methods.sellItem(this.tokenId, price).send({from: this.wallet.address})
              .on("transactionHash", () => {
                this.price.value = null;
                this.isDisabled = false;
                this.setLoadingStatus("enable");
              })
              .then(receipt => {
                if (receipt.events.SaleCreated.returnValues.tokenId == this.tokenId) {
                  this.$toasted.show(`Sale created`, {icon: "scale-balanced"});
                  this.$emit('saleCreated');
                } else {
                  this.logError("Transaction error", receipt);
                }
                this.setLoadingStatus("disable");
              })
              .catch(error => {
                this.isDisabled = false;
                this.setLoadingStatus("disable");
                this.logError("Transaction error", error);
              });
          }
        } else {
          this.approve();
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
