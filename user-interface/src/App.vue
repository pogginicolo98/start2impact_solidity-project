<template>
  <div id="app">
    <NavbarComponent v-if="isValidPath" />
    <router-view />
    <FooterComponent v-if="isValidPath"
                     :isFixedFooter="isFixedFooter" />
  </div>
</template>

<script>
  // @ is an alias to /src
  import NavbarComponent from "@/components/Navbar.vue";
  import FooterComponent from "@/components/Footer.vue";

  export default {
    name: "App",

    data() {
      return {
        path: ["Home", "Marketplace", "Mint", "Faucet"],
        fixedFooter: ["Home", "Marketplace", "Faucet"],
      };
    },

    computed: {
      isValidPath() {
        if (this.path.includes(this.$route.name)) {
          return true;
        }
        return false;
      },

      isFixedFooter() {
        if (this.fixedFooter.includes(this.$route.name)) {
          return true;
        }
        return false;
      },
    },

    components: {
      NavbarComponent,
      FooterComponent,
    },
  }
</script>

<style>
  html, body, #app {
    height: 100%;
  }
</style>
