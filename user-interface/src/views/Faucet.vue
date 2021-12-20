<template>
  <div class="faucet">
    <div class="container text-center mt-5">
      <h1 class="mb-3">Ropsten WISP token faucet</h1>
      <h5>Receive 1000 WISP per request</h5>
    </div>
    <div class="position-absolute top-50 start-50 translate-middle"
         v-if="!metamaskConnected">
         <div class="box">
           <div class="row justify-content-center mt-4">
             <div class="col-10">
               <form novalidate @submit.prevent="onSubmit">
                 <div class="mb-3">
                   <label for="addressInput" class="form-label">Enter your Ropsten address</label>
                   <input type="text" class="form-control text-center" id="addressInput" v-model="requestAddress">
                 </div>
                 <button type="submit" class="btn btn-primary mb-4">Send WISP</button>
               </form>
             </div>
           </div>
         </div>
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src

  export default {
    name: "Faucet",
    data() {
      return {
        requestAddress: null,
      }
    },
    computed: {
      metamaskConnected() {
        return this.$wallet.address !== null;
      },
    },
    methods: {
      onSubmit() {
        if (this.validate() && this.welcomeChest && this.$wallet.address) {
          this.welcomeChest.methods.request(this.requestAddress).send({from: this.$wallet.address})
            .then(receipt => {
              console.log(receipt);
            });
          this.welcomeChest.events.allEvents({fromBlock: "pending"}, (error, event) => {
            console.log(event);
          })
          this.requestAddress = null;
        }
      },
      validate() {
        return true;
      }
    },
    created() {
      if(this.$wallet.provider) {
        let Interface = require("../../../smart-contracts/artifacts/contracts/WelcomeChest.sol/WelcomeChest.json");
        let Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
        this.welcomeChest = new this.$web3.eth.Contract(Interface.abi, Address);
      }
    }
  };
</script>

<style scoped>
  .box {
    width: 38rem;
    text-align: center;
    border: 1px solid black;
    background-color: #fff;
  }
</style>
