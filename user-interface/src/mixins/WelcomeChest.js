import contractInfo from "@/utils/WelcomeChestConfig";

export default {
  data() {
    return {
      welcomeChest: null,
    }
  },

  created() {
    const { contract } = contractInfo;
    this.welcomeChest = new this.web3.eth.Contract(contract.abi, contract.address);
  },
};
