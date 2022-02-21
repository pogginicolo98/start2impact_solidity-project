<template>
  <div id="app">
    <NavbarComponent v-if="isValidPath" />
    <router-view />
    <FooterComponent v-if="isValidPath"
                     :isFixedFooter="isFixedFooter" />
  </div>
</template>

<script>
  import "@/assets/css/app.css";
  import FooterComponent from "@/components/Footer.vue";
  import NavbarComponent from "@/components/Navbar.vue";

  export default {
    name: "App",

    data() {
      return {
        path: ["Home", "Marketplace", "Profile", "Faucet", "NftDetails"],
        fixedFooter: ["Home", "Marketplace", "Faucet"],
      }
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
</style>
