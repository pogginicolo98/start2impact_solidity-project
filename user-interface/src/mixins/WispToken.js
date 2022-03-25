import contractInfo from "@/utils/WispTokenConfig";

export default {
  data() {
    return {
      wispToken: null,
    }
  },

  created() {
    const { contract } = contractInfo;
    this.wispToken = new this.web3.eth.Contract(contract.abi, contract.address);
  },
};
