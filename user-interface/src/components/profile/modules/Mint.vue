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
  </div>
</template>

<script>
  import store from "@/store";
  import { mapGetters } from "vuex";
  import DescriptionFieldComponent from "@/components/profile/forms/DescriptionField.vue";
  import ImageFieldComponent from "@/components/profile/forms/ImageField.vue";
  import NameFieldComponent from "@/components/profile/forms/NameField.vue";
  import treasureNFTMixin from "@/mixins/TreasureNFT";


  export default {
    name: "MintComponent",

    data() {
      return {
        btnText: "<i class='fa-solid fa-gavel me-2'></i>Craft",
        isPending: false,
        isDisabled: false,
        image: {
          errors: []
        },
        name: {
          errors: []
        },
        description: {
          errors: []
        },
      }
    },

    created() {
      store.commit("SET_MINTFORM", {image: null, preview: "", name: null, description: null});
    },

    computed: {
      ...mapGetters({
        wallet: "getWallet",
        form: "getMintForm",
        ipfs: "getIpfs",
        ipfsServer: "getServer",
      }),
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
          msg = "<span aria-hidden='true' class='spinner-border spinner-border-sm me-2' role='status'></span>Crafting";
          this.isPending = true;
        } else if (payload == "disable") {
          msg = "<i class='fa-solid fa-gavel me-2'></i>Craft";
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
              imageUri = `http://${this.ipfsServer}/ipfs/${imageCid.path}`;
            }
            const metadata = {
              "name": name,
              "description": description,
              "image": imageUri,
              "creator": this.wallet.address
            }
            const metadataCid = await this.ipfs.add(JSON.stringify(metadata));
            const metadataUri = `http://${this.ipfsServer}/ipfs/${metadataCid.path}`;

            this.treasureNFT.methods.mint(this.wallet.address, metadataUri).send({from: this.wallet.address})
              .on("transactionHash", () => {
                this.$refs.form.reset();
                store.commit("SET_MINTFORM", {image: null, preview: null, name: null, description: null});
                this.isDisabled = false;
                this.setLoadingStatus("enable");
              })
              .then(receipt => {
                if (receipt.events.Transfer.returnValues.to.toLowerCase() == this.wallet.address.toLowerCase()) {
                  this.$toasted.show(`Item crafted`, {icon: "gavel"});
                  this.$emit('nftMinted', receipt.events.Transfer.returnValues.tokenId);
                } else {
                  this.logError("Transaction error", receipt);
                }
                this.setLoadingStatus("disable");
              })
              .catch(error => {
                this.isDisabled = false;
                this.setLoadingStatus("disable");
                this.logError("Transaction error", error);
              });
          } catch (error) {
            this.logError("Transaction error", error);
            this.isDisabled = false;
          }
        }
      },
    },

    mixins: [
      treasureNFTMixin,
    ],

    components: {
      DescriptionFieldComponent,
      ImageFieldComponent,
      NameFieldComponent,
    },
  }
</script>

<style scoped>
</style>
