<template>
  <div class="faucet-content">
    <div class="row justify-content-center align-items-center height-100 mx-1">
      <div class="col-12 col-md-9 col-lg-7 col-xl-6 col-xl-6 box p-4 p-sm-5">

        <!-- Title -->
        <div class="text-center mb-5">
          <h1 class="mb-3">Open your welcome chest</h1>
          <p class="text-secondary">Get 1000 $WISP free, enter your address below and redeem!</p>
        </div>

        <!-- Form -->
        <form class="needs-validation"
              novalidate
              @submit.prevent="handleSubmit">

              <!-- Input address -->
              <div class="mb-3">
                <label class="d-block position-relative input-wrap"
                       :class="{'focusOn': isFocused,
                                'focusOff': !isFocused}">
                       <img alt="$WISP"
                            class="position-absolute top-50 start-0 translate-middle ms-3"
                            src="@/assets/images/token-logo-24x24.png">
                       <input aria-describedby="faucetFormFeedback"
                              class="form-control input-address"
                              placeholder="Ropsten address"
                              type="text"
                              v-model="destAddress.value"
                              :class="{'is-invalid': !destAddressValid}"
                              @blur="setFocused(false)"
                              @focus="setFocused(true)">
                </label>
                <div class="d-block text-start invalid-feedback"
                     id="faucetFormFeedback">
                     <ul>
                       <li v-for="(error, index) in destAddress.errors"
                           :key="index"
                           >{{ error }}
                       </li>
                     </ul>
                </div>
              </div>

              <!-- Submit button -->
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

        <!-- Spacer -->
        <div class="row justify-content-center my-2">
          <div class="col-10 text-secondary">
            <hr>
          </div>
        </div>

        <!-- Add token button -->
        <span class="d-grid btn-wrap mt-2">
              <button class="btn btn-primary px-4 py-2"
                      type="button"
                      @click="addToken"
                      ><i class="fa-solid fa-plus me-2"></i>Add token
              </button>
        </span>

      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import welcomeChestMixin from "@/mixins/WelcomeChest";
  import wispTokenMixin from "@/mixins/WispToken";

  export default {
    name: "FaucetContentComponent",

    data() {
      return {
        btnTextDefault: "<i class='fa-solid fa-box-open me-2'></i>Open",
        btnTextLoading: "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Opening",
        btnText: null,
        isFocused: false,
        isPending: false,
        isDisabled: false,
        destAddress: {
          value: null,
          errors: []
        },
      }
    },

    created() {
      this.btnText = this.btnTextDefault;
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
        if (payload == "enable") {
          this.btnText = this.btnTextLoading;
          this.isPending = true;
        } else if (payload == "disable") {
          this.btnText = this.btnTextDefault;
          this.isPending = false;
        }
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

      async handleSubmit() {
        if (this.validateForm()) {
          const to = this.destAddress.value.toLowerCase();
          this.isDisabled = true;

          await this.welcomeChest.methods.redeemTokens(to).send({from: this.wallet.address})
            .on("transactionHash", () => {
              this.destAddress.value = null;
              this.isDisabled = false;
              this.setLoadingStatus("enable");
            })
            .then(receipt => {
              if (receipt.events.TokensSent.returnValues.to.toLowerCase() === to) {
                const amount = this.web3.utils.fromWei(receipt.events.TokensSent.returnValues.amount);
                this.$toasted.show(`${amount} $WISP received`, {icon: "box-open" });
              } else {
                this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
              }
              this.setLoadingStatus("disable");
            })
            .catch(error => {
              if (error) {
                console.error("error occurred executing WelcomeChest method 'redeemTokens'");
                console.log(error);
                this.isDisabled = false;
                this.setLoadingStatus("disable");
                this.$toasted.show(`Something went wrong`, {icon: "skull-crossbones"});
              }
            });
        }
      },

      async addToken() {
        const params = {
          type: 'ERC20',
          options: {
            address: this.wispToken._address,
            symbol: 'WISP',
            decimals: 18,
          }
        };
        await window.ethereum.request({ method: 'wallet_watchAsset', params: params });
      }
    },

    mixins: [
      welcomeChestMixin,
      wispTokenMixin,
    ],
  }
</script>

<style scoped>
  .faucet-content {
    height: 100%;
  }

  .input-address {
    border-radius: 12px;
    border: none !important;
    padding-left: 27px;
    text-align: center;
  }
</style>
