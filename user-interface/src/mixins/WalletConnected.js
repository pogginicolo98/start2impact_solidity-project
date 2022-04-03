import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      wallet: "getWallet",
    }),

    walletConnected() {
      return this.wallet && this.wallet.address;
    },
  },
};
