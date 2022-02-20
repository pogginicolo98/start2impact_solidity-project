<template>
  <div class="sell-form">
    <form class="needs-validation"
          novalidate
          @submit.prevent="handleSell">

          <label class="mb-2"
                 for="priceInput"
                 >Price
          </label>
          <div class="input-wrap"
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
               id="priceFormFeedback">
               <ul>
                 <li v-for="(error, index) in price.errors"
                     :key="index"
                     >{{ error }}
                 </li>
               </ul>
          </div>

          <!-- Sell button -->
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

    data() {
      return {
        btnText: "Sell",
        isPending: false,
        isDisabled: false,
        price: {
          isFocus: false,
          value: null,
          errors: []
        },
      }
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
          msg = "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Pending";
          this.isPending = true;
        } else if (payload == "disable") {
          msg = "Sell";
          this.isPending = false;
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

      async handleSell() {
        if (this.validateForm()) {
          // try {
          //   const image = this.form.image;
          //   const name = this.form.name;
          //   const description = this.form.description;
          //   let imageUri = null;
          //   this.isDisabled = true;
          //
          //   if (image != null) {
          //     const imageCid = await this.ipfs.add(image);
          //     imageUri = `http://192.168.1.143/ipfs/${imageCid.path}`;
          //   }
          //   const metadata = {
          //     "name": name,
          //     "description": description,
          //     "image": imageUri,
          //     "creator": this.wallet.address
          //   }
          //   const metadataCid = await this.ipfs.add(JSON.stringify(metadata));
          //   const metadataUri = `http://192.168.1.143/ipfs/${metadataCid.path}`;
          //
          //   this.treasureNFT.methods.mint(this.wallet.address, metadataUri).send({from: this.wallet.address})
          //     .on("transactionHash", () => {
          //       this.$refs.form.reset();
          //       store.commit("SET_MINTFORM", {image: null, preview: null, name: null, description: null});
          //       this.isDisabled = false;
          //       this.setLoadingStatus("enable");
          //     })
          //     .then(receipt => {
          //       if (receipt.events.Transfer.returnValues.to.toLowerCase() == this.wallet.address.toLowerCase()) {
          //         this.$toasted.show(`Successfully minted`, {icon: "check"});
          //         this.$emit('nftMinted', receipt.events.Transfer.returnValues.tokenId);
          //       } else {
          //         this.$toasted.show(`Error occurred`, {icon: "ban"});
          //       }
          //       this.setLoadingStatus("disable");
          //     })
          //     .catch(error => {
          //       console.error("error occurred executing TreasureNFT method 'mint'");
          //       console.log(error);
          //       this.isDisabled = false;
          //       this.setLoadingStatus("disable");
          //       this.$toasted.show(`Transaction error`, {icon: "ban"});
          //     });
          // } catch (error) {
          //   console.error(error);
          //   this.$toasted.show(`IPFS error`, {icon: "ban"});
          //   this.isDisabled = false;
          // }
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
