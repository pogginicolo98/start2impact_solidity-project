<template>
  <div id="app">
    <NavbarComponent />
    <router-view />
    <FooterComponent />
  </div>
</template>

<script>
  // @ is an alias to /src
  import NavbarComponent from "@/components/Navbar.vue";
  import FooterComponent from "@/components/Footer.vue";

  export default {
    name: "App",
    components: {
      NavbarComponent,
      FooterComponent,
    }
  }
</script>

<style>
  html, body {
    height: 100%;
  }
</style>
