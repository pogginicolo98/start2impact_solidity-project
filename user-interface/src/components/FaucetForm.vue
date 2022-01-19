<template>
  <div class="faucet-form">
    <form novalidate
          @submit.prevent="handleRequest">
          <div class="row justify-content-center">
            <!-- Field -->
            <div class="col-12">
              <!-- Input -->
              <label class="d-block position-relative input-wrap"
                     :class="{'input-wrap-disabled': isDisabled,
                              'focus': isFocused}">
                     <i class="fa-brands fa-ethereum position-absolute top-50 start-0 translate-middle ms-3"></i>
                     <input aria-describedby="faucetFormFeedback"
                            class="form-control input-address"
                            placeholder="Ropsten address"
                            type="text"
                            v-model="destAddress.value"
                            :class="{'is-invalid': !destAddressValid}"
                            :disabled="isDisabled"
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
              </div> <!-- Feedback -->
            </div> <!-- Field -->

            <!-- Submit -->
            <div class="col-4 d-grid">
              <span class="d-grid btn-wrap"
                    :class="{'btn-wrap-disabled': btnDisabled,
                             'btn-wrap-pending': isPending}">
                    <button class="btn btn-primary px-4 py-2"
                            type="submit"
                            v-html="btnText"
                            :class="{'btn-pending': isPending}"
                            :disabled="btnDisabled">
                    </button>
              </span>
            </div>
          </div> <!-- Submit -->
    </form>
  </div> <!-- Faucet Form -->
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "FaucetFormComponent",

    data() {
      return {
        isFocused: false,
        isPending: false,
        btnText: "Request",
        btnDisabled: false,
        wcContract: null,
        destAddress: {
          value: null,
          errors: [],
        },
      }
    },

    created() {
      // Create WelcomeChest contract instance

      let wcInterface = require("../../../smart-contracts/artifacts/contracts/WelcomeChest.sol/WelcomeChest.json");
      let wcAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      this.wcContract = new this.web3.eth.Contract(wcInterface.abi, wcAddress);
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      // metamaskConnected() {
      //   return this.wallet && this.wallet.address;
      // },

      destAddressValid() {
        return this.destAddress.errors.length == 0
          ? true
          : false;
      },

      isDisabled() {
        return this.btnDisabled || this.isPending;
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
          const to = this.destAddress.value;
          this.btnDisabled = true;

          await this.wcContract.methods.requestTokens(to).send({from: this.wallet.address})
            .on("transactionHash", () => {
              this.destAddress.value = null;
              this.btnDisabled = false;
              this.setLoadingStatus("enable");
            })
            .then(receipt => {
              if (receipt.events.TokensSent.returnValues.to === to) {
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
                this.btnDisabled = false;
                this.setLoadingStatus("disable");
                this.$toasted.show(`Error occurred`, {icon: "ban"});
              }
            });
        }
      },
    }
  }
</script>

<style scoped>
  .input-address {
    background-color: #343434;
    border-radius: 12px;
    border: none;
    font-weight: bold;
    padding-left: 27px;
    text-align: center;
  }

  .input-wrap {
    padding: 1px;
    border-radius: 12px;
  }

  .focus {
    padding: 1px;
    border-radius: 12px;
    background: linear-gradient(90deg,#5ac9e5,#7c5bff);
  }

  .btn-wrap {
    padding: 1px;
    border-radius: 12px;
    background: hsla(0,0%,100%,.2);
  }

  .btn-wrap:hover {
    background: linear-gradient(90deg,#5ac9e5,#7c5bff);
  }

  .btn-wrap-disabled:hover  {
    background: hsla(0,0%,100%,.2) !important;
  }

  .input-wrap-disabled {
    background: hsla(0,0%,100%,.2);
  }

  .btn-wrap-pending {
    background: linear-gradient(90deg,#5ac9e5,#7c5bff);
  }

  .btn-pending {
    pointer-events: none;
  }

  input:disabled {
    opacity: 0.3;
  }
</style>




<form class="row justify-content-center mt-4"
      novalidate
      @submit.prevent="handleRequest">

      <!-- Name -->
      <div class="col-10">
        <label class="form-label"
               for="name"
               >Name
        </label>
        <div class="input-group has-validation">
          <input class="form-control"
                 id="name"
                 type="text"
                 v-model="name.value"
                 :class="{'is-invalid': !nameValid}"
                 :disabled="formDisabled">
          <div class="invalid-feedback">
            <ul>
              <li v-for="(error, index) in name.errors"
                  :key="index"
                  >{{ error }}Please enter the name of the NFT.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="col-10 mt-2">
        <label class="form-label"
               for="description"
               >Description
        </label>
        <div class="input-group has-validation">
          <textarea class="form-control"
                 id="description"
                 rows="5"
                 type="text"
                 v-model="description.value"
                 :class="{'is-invalid': !descriptionValid}"
                 :disabled="formDisabled">
          </textarea>
          <div class="invalid-feedback">
            <ul>
              <li v-for="(error, index) in description.errors"
                  :key="index"
                  >{{ error }}Please enter the description of the NFT.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div class="col-10 mt-2">
        <label class="form-label"
               for="image"
               >Image
        </label>
        <div class="input-group has-validation">
          <input accept="image/*"
                 class="form-control"
                 id="image"
                 type="file"
                 :class="{'is-invalid': !imageValid}"
                 :disabled="formDisabled"
                 @change="onImageSelected">
          <div class="invalid-feedback">
            <ul>
              <li v-for="(error, index) in image.errors"
                  :key="index"
                  >{{ error }}Please enter the image of the NFT.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Mint -->
      <div class="col-10 mt-4">
        <button class="btn btn-primary"
                type="submit"
                :disabled="formDisabled"
                v-html="mintBtn">
        </button>
      </div>
</form>
