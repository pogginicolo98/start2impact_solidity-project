import contractInfo from "@/utils/TreasureNFTConfig";

export default {
  data() {
    return {
      treasureNFT: null,
    }
  },

  created() {
    const { contract } = contractInfo;
    this.treasureNFT = new this.web3.eth.Contract(contract.abi, contract.address);
  },
};
