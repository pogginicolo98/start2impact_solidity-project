<template>
  <div class="description-field">
    <label class="mb-2"
           for="nameInput"
           >Description
    </label>
    <div class="input-wrap"
         :class="{'focusOff': !isFocus,
                  'focusOn': isFocus}">
         <textarea aria-describedby="descriptionFormFeedback"
                   class="form-control input-field"
                   id="descriptionInput"
                   rows="4"
                   placeholder="Provide a detailed description of your item."
                   :class="{'is-invalid': !isValid}"
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
  </div>
</template>

<script>
  import store from "@/store";

  export default {
    name: "DescriptionFieldComponent",

    props: {
      errors: {
        type: Array,
        required: true
      },
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
        store.commit("SET_DESCRIPTION", event.target.value);
      },
    },
  }
</script>

<style scoped>
</style>
