<template>
  <div class="mint-form">
    <form novalidate
          @submit.prevent="handleRequest">
          <div class="position-relative" style="width: 350px; height: 270px;" @mouseover="setOverlay(true)" @mouseleave="setOverlay(false)">
            <label for="imageInput">
              <input accept="image/*"
                     aria-describedby="imageFormFeedback"
                     class="form-control mt-4"
                     id="imageInput"
                     style="display: none;"
                     ref="image"
                     type="file"
                     :class="{'is-invalid': true}"
                     @change="onImageSelected">
              <div class="box-image-wrapper">
                <div class="box-image" :class="{'overlay': isOverlay}">
                  <div class="img-wrapper" v-show="imagePreview">
                    <img class="img-display"
                         :src="imagePreview">
                  </div>
                </div>
                <transition name="fade">
                  <i class="fa-regular fa-image position-absolute top-50 start-50 translate-middle img-icon" v-show="isOverlay"></i>
                </transition>
              </div>
            </label>
            <transition name="fade">
            <div v-show="isOverlay">
              <i class="fa-solid fa-xmark position-absolute top-0 end-0 reset-icon" v-show="imagePreview" @click="resetImage"></i>
            </div>
            </transition>
          </div>

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
    <button class="mt-5 btn btn-primary" type="button" name="button" @click="setError()">show error</button>
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
        overlay: false,
        imgDisabled: false,
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
      isOverlay() {
        return !this.imagePreview || this.overlay;
      },
      isDisabled() {
        return this.imgDisabled && this.imagePreview;
      }
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

        this.imagePreview = null;
        this.image.value = null;
        this.$refs["image"].value = null;
      },

      setOverlay(payload) {
        this.overlay = payload;
      },

      disableImage(payload) {
        this.imgDisabled = payload;
      },

      setError() {
        this.image.errors.push("Error test");
      }
    }
  }
</script>

<style scoped>
  .box-image-wrapper {
    width: 350px;
    height: 270px;
    padding: 5px;
    border: 3px dashed rgb(204, 204, 204);
    border-radius: 12px;
    cursor: pointer;
  }

  .box-image {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }

  .img-wrapper {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 12px;
    overflow: hidden;
  }

  .img-display {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .overlay {
    opacity: 0.5;
  }

  .reset-icon {
    font-size: 26px;
    color: #fff;
    cursor: pointer;
    margin-top: 10px;
    margin-right: 14px;
  }

  .img-icon {
    font-size: 64px;
    color: #fff;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

</style>
