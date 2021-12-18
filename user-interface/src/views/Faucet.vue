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
               <form>
                 <div class="mb-3">
                   <label for="addressInput" class="form-label">Enter your Ropsten address</label>
                   <input type="text" class="form-control text-center" id="addressInput">
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
    props: {
      metamaskConnected: {
        type: Boolean,
        required: true
      },
    },
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
