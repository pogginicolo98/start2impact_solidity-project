<template>
  <div class="image-field">
    <label class="form-label"
           for="imageUploader"
           >Image
    </label>
    <ImageUploaderComponent class="col-12 col-sm-6 col-md-5 col-xl-12 col-xxl-9"
                            id="imageUploader"
                            style="aspect-ratio: 1/1;"
                            :preview="preview"
                            @imageUpdated="onInput($event)" />
    <div class="invalid-feedback d-block mt-2"
         id="imageFormFeedback">
         <ul>
           <li v-for="(error, index) in errors"
               :key="index"
               >{{ error }}
           </li>
         </ul>
    </div>
  </div>
</template>

<script>
  import store from "@/store";
  import { mapGetters } from "vuex";
  import ImageUploaderComponent from "@/components/profile/forms/ImageUploader.vue";

  export default {
    name: "ImageFieldComponent",

    props: {
      errors: {
        type: Array,
        required: true
      },
    },

    computed: {
      ...mapGetters({
        preview: "getPreview",
      }),
    },

    methods: {
      onInput(payload) {
        store.commit("SET_PREVIEW", payload != null
          ? URL.createObjectURL(payload)
          : null
        );
        store.commit("SET_IMAGE", payload);
      },
    },

    components: {
      ImageUploaderComponent,
    },
  }
</script>

<style scoped>
</style>
