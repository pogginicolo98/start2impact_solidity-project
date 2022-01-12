<template>
  <div class="faucet-form">
    <form novalidate
          @submit.prevent="handleRequest">
          <div class="row justify-content-center">
            <!-- Input -->
            <div class="col-10">
              <label class="position-relative d-block">
                <i class="fa-brands fa-ethereum position-absolute top-50 start-0 translate-middle ms-3"></i>
                <input aria-describedby="faucetFormFeedback"
                       class="form-control input-address"
                       placeholder="Ropsten address"
                       type="text"
                       v-model="destAddress.value"
                       :class="{'is-invalid': !destAddressValid}"
                       :disabled="formDisabled">
              </label>
              <div class="invalid-feedback text-start d-block"
                   id="faucetFormFeedback">
                   <ul>
                     <li v-for="(error, index) in destAddress.errors"
                         :key="index"
                         >{{ error }}
                     </li>
                   </ul>
              </div> <!-- Feedback -->
            </div>

            <!-- Submit -->
            <div class="col-4">
              <span class="btn-wrap">
                <button class="btn btn-dark py-2"
                        type="submit"
                        :disabled="formDisabled"
                        v-html="sendWispBtn">
                </button>
              </span>
            </div>
          </div>
    </form>
  </div> <!-- Faucet form -->
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "FaucetFormComponent",

    data() {
      return {
        welcomeChest: null,
        sendWispBtn: "Send WISP",
        formDisabled: false,
        destAddress: {
          value: null,
          errors: [],
        },
      }
    },

    created() {
      /*
        Create WelcomeChest contract instance.
      */

      let Interface = require("../../../smart-contracts/artifacts/contracts/WelcomeChest.sol/WelcomeChest.json");
      let Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      this.welcomeChest = new this.web3.eth.Contract(Interface.abi, Address);
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
    },

    methods: {
      setLoadingStatus(action) {
        let msg = "";

        if (action.toString() === "enable")
          msg = "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Sending WSIP...";
        else if (action.toString() === "disable")
          msg = "Send WISP";
        else
          console.error(`setLoadingStatus(): invalid argument (action="${action}") `);

        this.sendWispBtn = msg;
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

      handleRequest() {
        /*
          Send a transaction to the method "request" of the WelcomeChest contract.
          The contract will send WISP tokens to the address provided.
        */

        if (this.validateForm()) {
          const to = this.destAddress.value;
          this.formDisabled = true;
          this.welcomeChest.methods.requestTokens(to).send({from: this.wallet.address})
            .on("transactionHash", () => {
              this.destAddress.value = null;
              this.setLoadingStatus("enable");
            })
            .on("receipt", receipt => {
              console.log(receipt);
              if (receipt.events.Sent.returnValues.to === to) {
                const amount = this.web3.utils.fromWei(receipt.events.Sent.returnValues.amount);
                this.$toasted.show(`Sent ${amount} WISP`, {icon: "check" });
              } else {
                this.$toasted.show(`Error`, {icon: "ban"});
              }
              this.formDisabled = false;
              this.setLoadingStatus("disable");
            })
            .on("error", (error, receipt) => {
              console.log("error + receipt");
              console.log(error);
              console.log(receipt);
              this.$toasted.show(`Error`, {icon: "ban"});
              this.formDisabled = false;
              this.setLoadingStatus("disable");
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

  .btn-dark {
    border: none;
    background-color: #2e2d2c;
    border-radius: 12px;
    width: 100%;
  }

  .btn-wrap {
    display: flex;
    width: 100%;
    padding: 1px;
    border-radius: 12px;
    background: linear-gradient(90deg,#5ac9e5,#7c5bff);
  }
</style>
