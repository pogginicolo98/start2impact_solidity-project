<template>
  <div class="mint-form">
    <div class="position-absolute top-50 start-50 translate-middle box">
      <form class="row justify-content-center mt-4"
            novalidate
            @submit.prevent="handleRequest">

            <!-- Name -->
            <div class="col-10">
              <label class="form-label"
                     for="name"
                     >Name
              </label>
              <div class="input-group has-validation">
                <input class="form-control"
                       id="name"
                       type="text"
                       v-model="name.value"
                       :class="{'is-invalid': !nameValid}"
                       :disabled="formDisabled">
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="(error, index) in name.errors"
                        :key="index"
                        >{{ error }}Please enter the name of the NFT.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="col-10 mt-2">
              <label class="form-label"
                     for="description"
                     >Description
              </label>
              <div class="input-group has-validation">
                <textarea class="form-control"
                       id="description"
                       rows="5"
                       type="text"
                       v-model="description.value"
                       :class="{'is-invalid': !descriptionValid}"
                       :disabled="formDisabled">
                </textarea>
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="(error, index) in description.errors"
                        :key="index"
                        >{{ error }}Please enter the description of the NFT.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Image -->
            <div class="col-10 mt-2">
              <label class="form-label"
                     for="image"
                     >Image
              </label>
              <div class="input-group has-validation">
                <input accept="image/*"
                       class="form-control"
                       id="image"
                       type="file"
                       :class="{'is-invalid': !imageValid}"
                       :disabled="formDisabled"
                       @change="onImageSelected">
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="(error, index) in image.errors"
                        :key="index"
                        >{{ error }}Please enter the image of the NFT.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Mint -->
            <div class="col-10 mt-4 mb-4">
              <button class="btn btn-primary"
                      type="submit"
                      :disabled="formDisabled"
                      v-html="mintBtn">
              </button>
            </div>
      </form>
    </div> <!-- Box -->
  </div> <!-- Mint form -->
</template>

<script>
  import { mapGetters } from "vuex";
  import { create } from 'ipfs-http-client'

  export default {
    name: "MintFormComponent",

    data() {
      return {
        treasureNft: null,
        ipfs: null,
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
      onImageSelected(event) {
        this.image.value = event.target.files[0];
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
        return false;
      },

      async handleRequest() {
        /*
          Send a transaction to the method "request" of the WelcomeChest contract.
          The contract will send WISP tokens to the address provided.
        */

        try {
          const imageIpfs = await this.ipfs.add(this.image.value);
          const imageUrl = `https://ipfs.io/ipfs/${imageIpfs.path}`;
          const metadata = {
            "name": this.name.value,
            "description": this.description.value,
            "image": imageUrl
          }
          console.log(url);
        } catch (error) {
          console.log('Error uploading file: ', error);
        }

        if (this.validateForm()) {
          // let name = this.name.value;
          // let description = this.description.value;
          // let image = this.image.value;
          let owner = this.wallet.address;
          let metadataUri = this.wallet.address;
          this.formDisabled = true;
          this.treasureNft.methods.mintTresure(owner, metadataUri).send({from: this.wallet.address})
            .on("transactionHash", () => {
              this.name.value = null;
              this.description.value = null;
              this.image.value = null;
              this.setLoadingStatus("enable");
            })
            .on("receipt", receipt => {
              console.log(receipt);
              if (receipt.events.Minted.returnValues.to === "to") {
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
  .box {
    width: 38rem;
    border: 1px solid black;
    background-color: #fff;
  }
</style>
