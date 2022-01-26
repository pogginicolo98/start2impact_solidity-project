<template>
  <div class="mint-form">
    <form class="needs-validation"
          novalidate
          @submit.prevent="validateImage">
          <div class="" style="width: 350px; height: 270px;">
            <ImageUploaderComponent :errors="image.errors"
                                    @imageSelected="onImageSelected($event)"/>
          </div>


      <button class="mt-5 btn btn-primary" type="submit" name="button">show error</button>
    </form>
  </div> <!-- Mint form -->
</template>

<script>
  import { mapGetters } from "vuex";
  import { create } from 'ipfs-http-client';
  import ImageUploaderComponent from "@/components/ImageUploader.vue";

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
        validated: false,
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
      isDisabled() {
        return this.imgDisabled && this.imagePreview;
      }
    },

    methods: {
      onImageSelected(payload) {
        this.image.value = payload;
      },

      validateImage() {
        this.image.errors = [];
        if (this.image.value != null) {
          let allowedExtension = ["jpeg", "jpg", "png"];
          let fileExtension = this.image.value.name.split(".").pop().toLowerCase();          
          for(let index in allowedExtension) {
            if(fileExtension === allowedExtension[index]) {
              return true;
            }
          }
          this.image.errors.push("Allowed formats: *." + allowedExtension.join(", *."));
          return false;
        }
        return true;
      },

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

      setError() {
        this.image.errors.push("Error test");
        this.validated = true;
      }
    },

    components: {
      ImageUploaderComponent,
    }
  }
</script>

<style scoped>
</style>
