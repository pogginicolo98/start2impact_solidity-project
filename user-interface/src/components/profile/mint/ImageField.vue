<template>
  <div class="image-field">
    <label class="form-label"
           for="imageUploader"
           >Image
    </label>
    <ImageUploaderComponent style="width: 18rem; height: 18rem;"
                            id="imageUploader"
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
  </div> <!-- Image field -->
</template>

<script>
  import { mapGetters } from "vuex";
  import store from "@/store";
  import ImageUploaderComponent from "@/components/profile/mint/ImageUploader.vue";

  export default {
    name: "ImageFieldComponent",

    props: {
      errors: {
        type: Array,
        required: true,
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
    }
  }
</script>

<style scoped>
</style>
