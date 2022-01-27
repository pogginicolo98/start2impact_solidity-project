<template>
  <div class="mint-form">
    <form class="needs-validation"
          novalidate
          @submit.prevent="handleRequest">

          <!-- Image -->
          <div class="mb-4">
            <ImageFieldComponent :errors="image.errors"
                                 @imageSelected="onImageSelected($event)" />
          </div>

          <!-- Name -->
          <div class="mb-4">
            <NameFieldComponent :errors="name.errors"
                                :isDisabled="formDisabled"
                                @nameSelected="onNameSelected($event)" />
          </div>

          <!-- Description -->
          <div class="mb-4">
            <DescriptionFieldComponent :errors="description.errors"
                                       :isDisabled="formDisabled"
                                       @descriptionSelected="onDescriptionSelected($event)" />
          </div>

      <button class="mt-5 btn btn-primary" type="submit" name="button">show error</button>
    </form>
  </div> <!-- Mint form -->
</template>

<script>
  import { mapGetters } from "vuex";
  import { create } from 'ipfs-http-client';
  import ImageFieldComponent from "@/components/mint/fields/ImageField.vue";
  import NameFieldComponent from "@/components/mint/fields/NameField.vue";
  import DescriptionFieldComponent from "@/components/mint/fields/DescriptionField.vue";

  export default {
    name: "MintFormComponent",

    data() {
      return {
        treasureNft: null,
        ipfs: null,
        formDisabled: false,
        mintBtn: "Mint",
        image: {
          focus: false,
          value: null,
          errors: [],
        },
        name: {
          focus: false,
          value: null,
          errors: [],
        },
        description: {
          focus: false,
          value: null,
          errors: [],
        },
      }
    },

    created() {
      /*
        Create TreasureNFT contract instance.
      */

      let Interface = require("../../../../smart-contracts/artifacts/contracts/TreasureNFT.sol/TreasureNFT.json");
      let Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      this.treasureNft = new this.web3.eth.Contract(Interface.abi, Address);
      this.ipfs = create('http://192.168.1.143:5001/');
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
      }),

      // metamaskConnected() {
      //   return this.wallet && this.wallet.address;
      // },
    },

    methods: {
      onImageSelected(payload) {
        this.image.value = payload;
      },

      onNameSelected(payload) {
        this.name.value = payload;
      },

      onDescriptionSelected(payload) {
        this.description.value = payload;
      },

      validateForm() {
        /*
            Validation form fields.

            :fields
            - Image:
                1) Allowed formats: "jpeg", "jpg", "png", "svg".
            - Name:
                1) The field cannot be empty.
        */
        let formValid = true;

        this.image.errors = [];
        if (this.image.value != null) {
          let allowedExtension = ["jpeg", "jpg", "png", "svg"];
          let fileExtension = this.image.value.name.split(".").pop().toLowerCase();
          let imageValid = false;
          for (let index in allowedExtension) {
            if(fileExtension === allowedExtension[index]) {
              imageValid = true;
              break;
            }
          }
          if (!imageValid) {
            this.image.errors.push("Allowed formats: *." + allowedExtension.join(", *."));
            formValid = false;
          }
        }

        this.name.errors = [];
        if (this.name.value == null) {
          this.name.errors.push("The name cannot be empty");
          formValid = false;
        }

        return formValid;
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

      async handleRequest() {
        /*
          Send a transaction to the method "request" of the WelcomeChest contract.
          The contract will send WISP tokens to the address provided.
        */

        if (this.validateForm()) {
          try {
            let imageUri = null;
            if (this.image.value != null) {
              const imageCid = await this.ipfs.add(this.image.value);
              imageUri = `http://192.168.1.143/ipfs/${imageCid.path}`;
            }
            const metadata = {
              "name": this.name.value,
              "description": this.description.value,
              "image": imageUri
            }
            const metadataCid = await this.ipfs.add(JSON.stringify(metadata));
            const metadataUri = `http://192.168.1.143/ipfs/${metadataCid.path}`;

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
    },

    components: {
      ImageFieldComponent,
      NameFieldComponent,
      DescriptionFieldComponent,
    }
  }
</script>

<style scoped>
</style>
