export default {
  state: {
    /**
     * @type File
     * @name image
     *
     * @type String
     * @name preview
     *
     * @type String
     * @name name
     *
     * @type String
     * @name description
     */
    mintForm: {
      image: undefined,
      preview: undefined,
      name: undefined,
      description: undefined,
    },
  },
  mutations: {
    SET_MINTFORM(state, payload) {
      state.mintForm = payload;
    },
    SET_IMAGE(state, payload) {
      state.mintForm.image = payload;
    },
    SET_PREVIEW(state, payload) {
      state.mintForm.preview = payload;
    },
    SET_NAME(state, payload) {
      state.mintForm.name = payload;
    },
    SET_DESCRIPTION(state, payload) {
      state.mintForm.description = payload;
    },
  },
  getters: {
    getMintForm: (state) => state.mintForm,
    getImage: (state) => state.mintForm.image,
    getPreview: (state) => state.mintForm.preview,
    getName: (state) => state.mintForm.name,
    getDescription: (state) => state.mintForm.description,
  },
};
