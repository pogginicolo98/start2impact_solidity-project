<template>
  <div class="navbarComponent">
    <nav class="navbar navbar-light">
      <div class="container">
        <router-link class="navbar-brand"
                     :to="{ name: 'Home' }"
                     ><img alt="logo"
                           src="../assets/logo.png">
        </router-link>
        <button class="btn btn-primary btn-nav px-4"
                >Connect
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    name: "NavbarComponent",
  }
</script>

<style scoped>
  .navbar {
    border-bottom: 1px solid #C7B1A9 !important;
    background: transparent !important;
  }

  .btn-nav {
    border-radius: 1rem !important;
  }
</style>
