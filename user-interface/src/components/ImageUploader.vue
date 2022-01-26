<template>
  <div class="image-uploader" style="width: 100%; height: 100%;">
    <div class="position-relative"
         style="width: 100%; height: 100%;"
         @mouseover="setOverlay(true)"
         @mouseleave="setOverlay(false)">
         <label for="imageInput" style="width: 100%; height: 100%;">
           <div class="box-image-wrapper">
             <div class="box-image"
                  :class="{'overlay': isOverlay}">
                  <div class="img-wrapper"
                       v-show="imagePreview">
                    <img class="img-display"
                         :src="imagePreview">
                  </div>
             </div>
             <transition name="fade">
               <i class="fa-regular fa-image position-absolute top-50 start-50 translate-middle img-icon"
                  v-show="isOverlay">
               </i>
             </transition>
           </div>
         </label>
         <input accept="image/*"
                class="form-control mt-4"
                id="imageInput"
                ref="image"
                style="display: none;"
                type="file"
                :class="{'is-invalid': true}"
                @change="onImageSelected">
         <div class="invalid-feedback">
           <ul>
             <li v-for="(error, index) in errors"
                 :key="index"
                 >{{ error }}
             </li>
           </ul>
         </div>
         <transition name="fade">
           <div v-show="isOverlay">
             <i class="fa-solid fa-xmark position-absolute top-0 end-0 reset-icon"
                v-show="imagePreview"
                @click="resetImage">
             </i>
           </div>
         </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ImageUploaderComponent",

    props: {
      errors: {
        type: Array,
        required: false
      }
    },

    data() {
      return {
        imagePreview: null,
        overlay: false,
      }
    },

    computed: {
      imageValid() {
        return this.errors.length == 0
          ? true
          : false;
      },

      isOverlay() {
        return !this.imagePreview || this.overlay;
      },
    },

    methods: {
      onImageSelected(event) {
        this.imagePreview = URL.createObjectURL(event.target.files[0]);
        this.$emit('imageSelected', event.target.files[0]);
      },

      resetImage() {
        this.imagePreview = null;
        this.$refs["image"].value = null;
        this.$emit('imageSelected', null);
      },

      setOverlay(payload) {
        this.overlay = payload;
      },
    },

  }
</script>

<style scoped>
  .box-image-wrapper {
    width: 100%;
    height: 100%;
    padding: 5px;
    border: 3px dashed rgb(204, 204, 204);
    border-radius: 12px;
    cursor: pointer;
  }

  .box-image {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }

  .img-wrapper {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 12px;
    overflow: hidden;
  }

  .img-display {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .overlay {
    opacity: 0.5;
  }

  .reset-icon {
    font-size: 26px;
    color: #fff;
    cursor: pointer;
    margin-top: 10px;
    margin-right: 14px;
  }

  .img-icon {
    font-size: 64px;
    color: #fff;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
