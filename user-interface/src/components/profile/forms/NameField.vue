<template>
  <div class="name-field">
    <label class="mb-2"
           for="nameInput"
           >Name
    </label>
    <div class="input-wrap"
         :class="{'focusOff': !isFocus,
                  'focusOn': isFocus}">
         <input aria-describedby="nameFormFeedback"
                class="form-control input-field"
                id="nameInput"
                placeholder="Item name"
                type="text"
                :class="{'is-invalid': !isValid}"
                @blur="setFocus(false)"
                @change="onInput"
                @focus="setFocus(true)">
    </div>
    <div class="invalid-feedback d-block mt-2"
         id="nameFormFeedback">
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
  import store from "@/store";

  export default {
    name: "NameFieldComponent",

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
        store.commit("SET_NAME", event.target.value);
      },
    },
  }
</script>

<style scoped>
</style>
