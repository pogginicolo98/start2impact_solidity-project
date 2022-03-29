<template>
  <div id="app">
    <NavbarComponent class="sticky-top" v-if="isValidPath" />
    <div class="content">
      <router-view />
    </div>
    <div class="footer"
         v-if="isValidPath">
         <FooterComponent />
    </div>
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
      }
    },

    computed: {
      isValidPath() {
        if (this.path.includes(this.$route.name)) {
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
