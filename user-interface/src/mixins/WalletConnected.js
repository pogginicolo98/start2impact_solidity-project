import { mapGetters } from "vuex";

export default {
  data() {
    return {
      firstLoading: true,
    }
  },
  
  created() {
    // Waiting for wallet initialization
    setTimeout(() => {
      this.firstLoading = false;
    }, 300);
  },

  computed: {
    ...mapGetters({
      wallet: "getWallet",
    }),

    walletConnected() {
      return this.wallet && this.wallet.address;
    },
  },
};
