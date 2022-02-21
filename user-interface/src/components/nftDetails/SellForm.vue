<template>
  <div class="sell-form">
    <form class="needs-validation"
          novalidate
          @submit.prevent="handleSell">

          <!-- Price -->
          <label class="mb-2"
                 for="priceInput"
                 v-if="isApproved"
                 >Price
          </label>
          <div class="input-wrap"
               v-if="isApproved"
               :class="{'focusOff': !price.isFocus,
                        'focusOn': price.isFocus}">
               <input aria-describedby="priceFormFeedback"
                      class="form-control input-field"
                      id="priceInput"
                      placeholder="Amount in $WISP"
                      type="number"
                      v-model="price.value"
                      :class="{'is-invalid': !isValid}"
                      @blur="setFocus(false)"
                      @focus="setFocus(true)">
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
  </div> <!-- Price field -->
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
        btnText: "Approve",
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
      setTimeout(async () => {
        const contractApproved = await this.treasureNFT.methods.isApprovedForAll(this.wallet.address, this.merchant._address).call();
        if (contractApproved) {
          this.isApproved = true;
          this.btnText = "Sell";
        } else {
          this.isApproved = false;
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
    },

    methods: {
      setFocus(payload) {
        this.price.isFocus = payload;
      },

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
            ? "Sell"
            : "Approve";
        }
        this.btnText = msg;
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
          this.price.errors.push("The price exceeds 18 decimals");
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
          this.price.errors.push("The price exceeds the maximum limit of the ERC20 standard");
          formValid = false;
        }
        return formValid;
      },

      approve() {
        this.isDisabled = true;
        this.treasureNFT.methods.setApprovalForAll(this.merchant._address, true).send({from: this.wallet.address})
          .on("transactionHash", () => {
            this.isDisabled = false;
            this.setLoadingStatus("enable");
          })
          .then(receipt => {
            if (receipt.events.ApprovalForAll.returnValues.approved == true) {
              this.isApproved = true;
              this.$toasted.show(`Approved`, {icon: "check"});
            } else {
              this.$toasted.show(`Approval error`, {icon: "ban"});
            }
            this.setLoadingStatus("disable");
          })
          .catch(error => {
            console.error("error occurred executing TreasureNFT method 'setApprovalForAll'");
            console.log(error);
            this.isDisabled = false;
            this.isApproved = false;
            this.setLoadingStatus("disable");
            this.$toasted.show(`Approval error`, {icon: "ban"});
          });
      },

      handleSell() {
        if (this.isApproved) {
          if (this.validateForm()) {
            this.isDisabled = true;
            this.merchant.methods.sellItem(this.tokenId, this.web3.utils.toWei(this.price.value.toString())).send({from: this.wallet.address})
              .on("transactionHash", () => {
                this.price.value = null;
                this.isDisabled = false;
                this.setLoadingStatus("enable");
              })
              .then(receipt => {
                if (receipt.events.SaleCreated.returnValues.tokenId == this.tokenId) {
                  this.$toasted.show(`Sale created`, {icon: "check"});
                } else {
                  this.$toasted.show(`Transaction error 1`, {icon: "ban"});
                }
                this.setLoadingStatus("disable");
              })
              .catch(error => {
                console.error("error occurred executing Merchant method 'sellItem'");
                console.log(error);
                this.isDisabled = false;
                this.setLoadingStatus("disable");
                this.$toasted.show(`Transaction error`, {icon: "ban"});
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
