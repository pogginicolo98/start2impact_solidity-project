<template>
  <div class="mint-form">
    <form novalidate
          @submit.prevent="handleRequest">
          <div class="box-image position-relative">
            <i class="fa-regular fa-image position-absolute top-50 start-50 translate-middle" style="font-size: 64px;" v-if="!imagePreview"></i>
            <i class="fa-solid fa-x position-absolute top-0 end-0 mt-2 me-2 reset" v-else @click="resetImage"></i>
            <img class="img-fluid"
                 :src="imagePreview">
          </div>
          <input accept="image/*"
                 aria-describedby="imageFormFeedback"
                 class="form-control mt-4"
                 ref="image"
                 type="file"
                 :class="{'is-invalid': !imageValid}"
                 @change="onImageSelected">
          <div class="invalid-feedback"
               id="imageFormFeedback">
               <ul>
                 <li v-for="(error, index) in image.errors"
                     :key="index"
                     >{{ error }}
                 </li>
               </ul>
          </div>


    </form>
  </div> <!-- Mint form -->
</template>

<script>
  import { mapGetters } from "vuex";
  import { create } from 'ipfs-http-client';

  export default {
    name: "MintFormComponent",

    data() {
      return {
        treasureNft: null,
        mintBtn: "Mint",
        formDisabled: false,
        name: {
          value: null,
          errors: [],
        },
        description: {
          value: null,
          errors: [],
        },
        image: {
          value: null,
          errors: [],
        },
        imagePreview: null,
        ipfs: null,
      }
    },

    created() {
      /*
        Create TreasureNFT contract instance.
      */

      let Interface = require("../../../smart-contracts/artifacts/contracts/TreasureNFT.sol/TreasureNFT.json");
      let Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      this.treasureNft = new this.web3.eth.Contract(Interface.abi, Address);
      this.ipfs = create('http://192.168.1.142:5001/');
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      // metamaskConnected() {
      //   return this.wallet && this.wallet.address;
      // },

      nameValid() {
        return this.name.errors.length == 0
          ? true
          : false;
      },
      descriptionValid() {
        return this.description.errors.length == 0
          ? true
          : false;
      },
      imageValid() {
        return this.image.errors.length == 0
          ? true
          : false;
      },
    },

    methods: {
      setLoadingStatus(action) {
        let msg = "";

        if (action.toString() === "enable")
          msg = "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Minting...";
        else if (action.toString() === "disable")
          msg = "Mint";
        else
          console.error(`setLoadingStatus(): invalid argument (action="${action}") `);

        this.mintBtn = msg;
      },

      validateForm() {
        /*
            Validation form fields.

            :fields
            - Name:
                1) The field cannot be empty.
                2) The field cannot exceed 24 characters.
            - Description:
                1) The field cannot exceed 256 characters.
            - Image:
                1) Allowed formats: "jpeg", "jpg", "png".
        */

        // this.destAddress.errors = [];
        // if (!this.web3.utils.isAddress(this.destAddress.value)) {
        //   this.destAddress.errors.push("Please enter a valid Ropsten address");
        //   return false;
        // }
        return true;
      },

      async handleRequest() {
        /*
          Send a transaction to the method "request" of the WelcomeChest contract.
          The contract will send WISP tokens to the address provided.
        */

        if (this.validateForm()) {
          try {
            const imageCid = await this.ipfs.add(this.image.value);
            const imageUri = `http://192.168.1.142/ipfs/${imageCid.path}`;
            const metadata = {
              "name": this.name.value,
              "description": this.description.value,
              "image": imageUri
            }
            const metadataCid = await this.ipfs.add(JSON.stringify(metadata));
            const metadataUri = `http://192.168.1.142/ipfs/${metadataCid.path}`;

            this.formDisabled = true;
            this.treasureNft.methods.mint(this.wallet.address, metadataUri).send({from: this.wallet.address})
              .on("transactionHash", () => {
                this.name.value = null;
                this.description.value = null;
                this.image.value = null;
                this.setLoadingStatus("enable");
              })
              .on("receipt", receipt => {
                console.log(receipt);
                // if (receipt.events.Minted.returnValues.to === "to") {
                //   const amount = this.web3.utils.fromWei(receipt.events.Sent.returnValues.amount);
                //   this.$toasted.show(`Sent ${amount} WISP`, {icon: "check" });
                // } else {
                //   this.$toasted.show(`Error`, {icon: "ban"});
                // }
                this.$toasted.show(`Minted`, {icon: "check"});
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
          } catch (error) {
            console.log('Error uploading file: ', error);
          }
        }
      },

      onImageSelected(event) {
        this.image.value = event.target.files[0];
        this.imagePreview = URL.createObjectURL(event.target.files[0]);
      },

      resetImage() {
        this.image.value = null;
        this.imagePreview = null;
        this.$refs["image"].value = null;
      },
    }
  }
</script>

<style scoped>
  .box {
    width: 38rem;
    border: 1px solid black;
    background-color: #fff;
    margin-right: auto;
    margin-left: auto;
  }

  .box-image {
    width: 350px;
    height: 270px;
    padding:4px;
    border: 3px dashed rgb(204, 204, 204);
    border-radius: 12px;
  }

  .reset {
    font-size: 24px;
    color: #a8a6a6;
    cursor: pointer;
  }

  .reset:hover {
    color: #fff;
  }
</style>
