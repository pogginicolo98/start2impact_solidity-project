<template>
  <div class="faucet-form">
    <form class="needs-validation"
          novalidate
          @submit.prevent="handleRequest">

          <!-- Field -->
          <div class="mb-4">

            <!-- Input -->
            <label class="d-block position-relative input-wrap"
                   :class="{'focusOn': isFocused,
                            'focusOff': !isFocused}">
                   <i class="fa-brands fa-ethereum position-absolute top-50 start-0 translate-middle ms-3"></i>
                   <input aria-describedby="faucetFormFeedback"
                          class="form-control input-address"
                          placeholder="Ropsten address"
                          type="text"
                          v-model="destAddress.value"
                          :class="{'is-invalid': !destAddressValid}"
                          @blur="setFocused(false)"
                          @focus="setFocused(true)">
            </label> <!-- Input -->

            <!-- Feedback -->
            <div class="d-block text-start invalid-feedback"
                 id="faucetFormFeedback">
                 <ul>
                   <li v-for="(error, index) in destAddress.errors"
                       :key="index"
                       >{{ error }}
                   </li>
                 </ul>
            </div>

          </div> <!-- Field -->

          <!-- Request button -->
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
  </div> <!-- Faucet Form -->
</template>

<script>
  import { mapGetters } from "vuex";
  import welcomeChestMixin from "@/mixins/WelcomeChest";

  export default {
    name: "FaucetFormComponent",

    data() {
      return {
        isFocused: false,
        isPending: false,
        btnText: "Request",
        isDisabled: false,
        destAddress: {
          value: null,
          errors: []
        },
      }
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      destAddressValid() {
        return this.destAddress.errors.length == 0
          ? true
          : false;
      },
    },

    methods: {
      setFocused(payload) {
        this.isFocused = payload;
      },

      setLoadingStatus(payload) {
        // Set the button text and pending status

        let msg = "";
        if (payload == "enable") {
          msg = "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Pending";
          this.isPending = true;
        } else if (payload == "disable") {
          msg = "Request";
          this.isPending = false;
        }
        this.btnText = msg;
      },

      validateForm() {
        /*
            Validation form fields.

            :fields
            - destAddress:
                1) The field cannot be empty.
                2) The field must be a valid Ethereum address.
        */

        this.destAddress.errors = [];
        if (!this.web3.utils.isAddress(this.destAddress.value)) {
          this.destAddress.errors.push("Please enter a valid Ropsten address");
          return false;
        }
        return true;
      },

      async handleRequest() {
        // Make a request to the WelcomeChest contract in order to receive the tokens at the specified address

        if (this.validateForm()) {
          const to = this.destAddress.value.toLowerCase();
          this.isDisabled = true;

          await this.welcomeChest.methods.requestTokens(to).send({from: this.wallet.address})
            .on("transactionHash", () => {
              this.destAddress.value = null;
              this.isDisabled = false;
              this.setLoadingStatus("enable");
            })
            .then(receipt => {
              if (receipt.events.TokensSent.returnValues.to.toLowerCase() === to) {
                const amount = this.web3.utils.fromWei(receipt.events.TokensSent.returnValues.amount);
                this.$toasted.show(`${amount} $WISP received`, {icon: "check" });
              } else {
                this.$toasted.show(`Error occurred`, {icon: "ban"});
              }
              this.setLoadingStatus("disable");
            })
            .catch(error => {
              if (error) {
                console.error("error occurred executing WelcomeChest method 'requestTokens'");
                console.log(error);
                this.isDisabled = false;
                this.setLoadingStatus("disable");
                this.$toasted.show(`Error occurred`, {icon: "ban"});
              }
            });
        }
      },
    },

    mixins: [
      welcomeChestMixin,
    ],
  }
</script>

<style scoped>
  .input-address {
    border-radius: 12px;
    border: none !important;
    padding-left: 27px;
    text-align: center;
  }
</style>
