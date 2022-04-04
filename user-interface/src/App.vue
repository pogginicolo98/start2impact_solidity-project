<template>
  <div id="app">

    <!-- Navbar -->
    <NavbarComponent />

    <!-- Content -->
    <div class="content">
      <router-view />
    </div>

    <!-- Footer -->
    <div class="footer">
      <FooterComponent />
    </div>

  </div>
</template>

<script>
  import "@/assets/css/app.css";
  import FooterComponent from "@/components/footer/Footer.vue";
  import NavbarComponent from "@/components/navbar/Navbar.vue";

  export default {
    name: "App",

    components: {
      FooterComponent,
      NavbarComponent,
    },
  }
</script>

<style>
</style>
