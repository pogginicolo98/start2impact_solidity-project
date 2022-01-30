import contractInfo from "@/utils/MerchantConfig";

export default {
  data() {
    return {
      merchant: null,
    }
  },

  created() {
    const { contract } = contractInfo;
    this.merchant = new this.web3.eth.Contract(contract.abi, contract.address);
  },
};
