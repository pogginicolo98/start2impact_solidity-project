export default {
  state: {
    /**
     * @type Object
     * @name ipfs
     *
     * @type String
     * @name server
     */
    ipfs: undefined,
    server: undefined,
  },
  mutations: {
    SET_IPFS(state, payload) {
      state.ipfs = payload;
    },
    SET_SERVER(state, payload) {
      state.server = payload;
    },
  },
  getters: {
    getIpfs: (state) => state.ipfs,
    getServer: (state) => state.server,
  },
};
