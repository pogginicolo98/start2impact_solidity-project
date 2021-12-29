<template>
  <div class="faucet">
    <div class="container text-center mt-5">
      <!-- Title -->
      <h1 class="mb-3">Ropsten WISP token faucet</h1>
      <h5>Receive 1000 WISP per request</h5>

      <!-- Form -->
      <div class="position-absolute top-50 start-50 translate-middle box">
        <div class="row justify-content-center mt-4">
          <div class="col-10">
            <form novalidate
                  @submit.prevent="handleRequest">
                  <label class="form-label"
                         for="addressInput"
                         >Enter your Ropsten address
                  </label>
                  <div class="input-group has-validation mb-3">
                    <input class="form-control text-center"
                           id="addressInput"
                           type="text"
                           v-model="destAddress.value"
                           :class="{'is-invalid': !destAddressValid}"
                           :disabled="formDisabled">
                    <div class="invalid-feedback text-start">
                      <ul>
                        <li v-for="(error, index) in destAddress.errors"
                            :key="index"
                            >{{ error }}
                        </li>
                      </ul>
                    </div> <!-- Feedback -->
                  </div> <!-- Input group -->
                  <button class="btn btn-primary mb-4"
                          type="submit"
                          :disabled="formDisabled"
                          v-html="sendWispBtn">
                  </button>
            </form>
          </div> <!-- Col-10 -->
        </div> <!-- Row -->
      </div> <!-- Box -->
    </div> <!-- Container -->
  </div> <!-- Faucet -->
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "Faucet",

    data() {
      return {
        welcomeChest: null,
        sendWispBtn: "Send WISP",
        formDisabled: false,
        destAddress: {
          value: null,
          errors: [],
        },
        destAddress1: null
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
            Validation send WISP form fields.

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
          this.welcomeChest.methods.request(to).send({from: this.wallet.address})
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
  };
</script>

<style scoped>
  .box {
    width: 38rem;
    border: 1px solid black;
    background-color: #fff;
  }
</style>
