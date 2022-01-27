<template>
  <div class="image-uploader"
       @mouseover="setOverlay(true)"
       @mouseleave="setOverlay(false)">

       <!-- Box image -->
       <label class="image-label"
              for="imageInput">
              <div class="box-image-wrapper">

                <!-- Image preview -->
                <div class="box-image"
                     :class="{'overlay': isOverlay}">
                     <div class="image-wrapper"
                          v-show="preview">
                       <img class="image-display"
                            :src="preview">
                     </div>
                </div>

                <!-- Overlay -->
                <transition name="fade">
                  <i class="fa-regular fa-image position-absolute top-50 start-50 translate-middle image-icon"
                     v-show="isOverlay">
                  </i>
                </transition>
              </div>
       </label>

       <!-- Hidden input image -->
       <input accept="image/*"
              aria-describedby="imageFormFeedback"
              class="form-control image-input mt-4"
              id="imageInput"
              ref="image"
              type="file"
              @change="onImageSelected">

       <!-- Reset image -->
       <transition name="fade">
         <div v-show="isOverlay">
           <i class="fa-solid fa-xmark position-absolute top-0 end-0 reset-icon"
              v-show="preview"
              @click="resetImage">
           </i>
         </div>
       </transition>
  </div> <!-- Image uploader -->
</template>

<script>
  export default {
    name: "ImageUploaderComponent",

    data() {
      return {
        preview: null,
        overlay: false,
      }
    },

    computed: {
      isOverlay() {
        return !this.preview || this.overlay;
      },
    },

    methods: {
      onImageSelected(event) {
        this.preview = URL.createObjectURL(event.target.files[0]);
        this.$emit('imageUpdated', event.target.files[0]);
      },

      resetImage() {
        this.preview = null;
        this.$refs["image"].value = null;
        this.$emit('imageUpdated', null);
      },

      setOverlay(payload) {
        this.overlay = payload;
      },
    },

  }
</script>

<style scoped>
  .image-uploader {
    position: relative;
  }

  .image-label {
    width: 100%;
    height: 100%;
  }

  .box-image-wrapper {
    width: 100%;
    height: 100%;
    padding: 5px;
    border: 1px solid hsla(0,0%,100%,.2);
    border-radius: 12px;
    cursor: pointer;
    background-color: #252423;
  }

  .box-image {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 12px;
    overflow: hidden;
  }

  .image-display {
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

  .image-icon {
    font-size: 64px;
    color: #fff;
  }

  .image-input {
    display: none;
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
