export default {
  state: {
    /**
     * @type Object
     * @name ipfs
     */
    ipfs: undefined,
  },
  mutations: {
    SET_IPFS(state, payload) {
      state.ipfs = payload;
    },
  },
  getters: {
    getIpfs: (state) => state.ipfs,
  },
};
