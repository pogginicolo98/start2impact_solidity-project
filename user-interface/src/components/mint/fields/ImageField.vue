<template>
  <div class="image-field">
    <label class="form-label"
           for="imageUploader"
           >Image
    </label>
    <ImageUploaderComponent style="width: 350px; height: 270px;"
                            id="imageUploader"
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
  </div> <!-- Name field -->
</template>

<script>
  import ImageUploaderComponent from "@/components/mint/fields/ImageUploader.vue";

  export default {
    name: "ImageFieldComponent",

    props: {
      errors: {
        type: Array,
        required: true,
      },
    },

    data() {
      return {
        isFocus: false,
      }
    },

    methods: {
      onInput(payload) {
        this.$emit('imageSelected', payload);
      },
    },

    components: {
      ImageUploaderComponent,
    }
  }
</script>

<style scoped>
</style>
