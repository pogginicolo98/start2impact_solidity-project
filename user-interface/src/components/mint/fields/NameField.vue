<template>
  <div class="name-field">
    <label class="mb-2"
           for="nameInput"
           >Name
    </label>
    <div class="input-wrap"
         :class="{'input-wrap-disabled': isDisabled,
                  'focusOff': !isFocus,
                  'focusOn': isFocus}">
         <input aria-describedby="nameFormFeedback"
                class="form-control input-field"
                id="nameInput"
                placeholder="Item name"
                type="text"
                :class="{'is-invalid': !isValid}"
                :disabled="isDisabled"
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
  export default {
    name: "NameFieldComponent",

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
        this.$emit('nameSelected', event.target.value);
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
