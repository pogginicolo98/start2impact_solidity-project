<template>
  <div class="description-field">
    <label class="mb-2"
           for="nameInput"
           >Description
    </label>
    <div class="input-wrap"
         :class="{'input-wrap-disabled': isDisabled,
                  'focusOff': !isFocus,
                  'focusOn': isFocus}">
         <textarea aria-describedby="descriptionFormFeedback"
                   class="form-control input-field"
                   id="descriptionInput"
                   rows="5"
                   placeholder="Provide a detailed description of your item."
                   :class="{'is-invalid': !isValid}"
                   :disabled="isDisabled"
                   @blur="setFocus(false)"
                   @change="onInput"
                   @focus="setFocus(true)">
         </textarea>
    </div>
    <div class="invalid-feedback d-block mt-2"
         id="descriptionFormFeedback">
         <ul>
           <li v-for="(error, index) in errors"
               :key="index"
               >{{ error }}
           </li>
         </ul>
    </div>
  </div> <!-- Description field -->
</template>

<script>
  export default {
    name: "DescriptionFieldComponent",

    props: {
      isDisabled: {
        type: Boolean,
        required: true,
      },
      errors: {
        type: Array,
        required: true,
      }
    },

    data() {
      return {
        isFocus: false,
      }
    },

    computed: {
      isValid() {
        return this.errors.length == 0
          ? true
          : false;
      },
    },

    methods: {
      setFocus(payload) {
        this.isFocus = payload;
      },

      onInput(event) {
        this.$emit('descriptionSelected', event.target.value);
      },
    },
  }
</script>

<style scoped>
  .input-field {
    border-radius: 12px;
    border: none;
  }

  .input-wrap {
    padding: 1px;
    border-radius: 12px;
  }

  .focusOff {
    padding: 1px;
    border-radius: 12px;
    background: hsla(0,0%,100%,.2);
  }

  .focusOn {
    padding: 1px;
    border-radius: 12px;
    background: linear-gradient(90deg,#5ac9e5,#7c5bff);
  }
</style>
