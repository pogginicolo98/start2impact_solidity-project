<template>
  <div class="mint">
    <form class="needs-validation"
          novalidate
          ref="form"
          @submit.prevent="handleRequest">

          <!-- Image -->
          <div class="mb-4">
            <ImageFieldComponent :errors="image.errors" />
          </div>

          <!-- Name -->
          <div class="mb-4">
            <NameFieldComponent :errors="name.errors" />
          </div>

          <!-- Description -->
          <div class="mb-4">
            <DescriptionFieldComponent :errors="description.errors" />
          </div>

          <!-- Mint button -->
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
  </div> <!-- Mint -->
</template>

<script>
  import { mapGetters } from "vuex";
  import store from "@/store";
  import ImageFieldComponent from "@/components/profile/mint/ImageField.vue";
  import NameFieldComponent from "@/components/profile/mint/NameField.vue";
  import DescriptionFieldComponent from "@/components/profile/mint/DescriptionField.vue";

  export default {
    name: "MintComponent",

    data() {
      return {
        treasureNft: null,
        btnText: "Mint",
        isPending: false,
        isDisabled: false,
        image: {
          focus: false,
          errors: [],
        },
        name: {
          focus: false,
          errors: [],
        },
        description: {
          focus: false,
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

      store.commit("SET_MINTFORM", {image: null, preview: "", name: null, description: null});
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
        form: "getMintForm",
        ipfs: "getIpfs",
      }),

      // metamaskConnected() {
      //   return this.wallet && this.wallet.address;
      // },
    },

    methods: {
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
        if (this.form.image != null) {
          let allowedExtension = ["jpeg", "jpg", "png", "svg"];
          let fileExtension = this.form.image.name.split(".").pop().toLowerCase();
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
        if (this.form.name == null) {
          this.name.errors.push("The name cannot be empty");
          formValid = false;
        }

        return formValid;
      },

      setLoadingStatus(payload) {
        // Set the button text and pending status

        let msg = "";
        if (payload == "enable") {
          msg = "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Minting";
          this.isPending = true;
        } else if (payload == "disable") {
          msg = "Mint";
          this.isPending = false;
        }
        this.btnText = msg;
      },

      async handleRequest() {
        /*
          Send a transaction to the method "mint" of the TreasureNFT contract.
          The contract will mint a new token with provided metadata and transfer it to the user's address.
        */

        if (this.validateForm()) {
          try {
            const image = this.form.image;
            const name = this.form.name;
            const description = this.form.description;
            let imageUri = null;
            this.isDisabled = true;

            if (image != null) {
              const imageCid = await this.ipfs.add(image);
              imageUri = `http://192.168.1.143/ipfs/${imageCid.path}`;
            }
            const metadata = {
              "name": name,
              "description": description,
              "image": imageUri
            }
            const metadataCid = await this.ipfs.add(JSON.stringify(metadata));
            const metadataUri = `http://192.168.1.143/ipfs/${metadataCid.path}`;

            this.treasureNft.methods.mint(this.wallet.address, metadataUri).send({from: this.wallet.address})
              .on("transactionHash", () => {
                this.$refs.form.reset();
                store.commit("SET_MINTFORM", {image: null, preview: null, name: null, description: null});
                this.isDisabled = false;
                this.setLoadingStatus("enable");
              })
              .then(receipt => {
                if (receipt.events.Transfer.returnValues.to.toLowerCase() == this.wallet.address.toLowerCase()) {
                  this.$toasted.show(`Successfully minted`, {icon: "check"});
                  this.$emit('nftMinted', receipt.events.Transfer.returnValues.tokenId);
                } else {
                  this.$toasted.show(`Error occurred`, {icon: "ban"});
                }
                this.setLoadingStatus("disable");
              })
              .catch(error => {
                console.error("error occurred executing TreasureNFT method 'mint'");
                console.log(error);
                this.isDisabled = false;
                this.setLoadingStatus("disable");
                this.$toasted.show(`Transaction error`, {icon: "ban"});
              });
          } catch (error) {
            console.error(error);
            this.$toasted.show(`IPFS error`, {icon: "ban"});
            this.isDisabled = false;
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

  .btn-wrap-pending {
    background: linear-gradient(90deg,#5ac9e5,#7c5bff);
  }

  .btn-pending {
    pointer-events: none;
  }
</style>
