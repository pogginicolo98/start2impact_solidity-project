<template>
  <div class="home">
    <div class="container height-100">
      <div class="row align-items-center height-100">
        <div class="col text-center">

          <!-- Title -->
          <div data-aos="fade-zoom-in"
               data-aos-easing="ease-in-out-cubic"
               data-aos-delay="500"
               data-aos-duration="2200">
               <p class="font-fantasy fs-70px mb-0">Welcome to Echoes of the past</p>
          </div>
          <div data-aos="fade-zoom-in"
               data-aos-easing="ease-in-out-cubic"
               data-aos-delay="500"
               data-aos-duration="2200">
               <p class="font-fantasy fs-32px text-secondary">An NFT marketplace with no back-end</p>
          </div>

          <!-- Launch button -->
          <div data-aos="fade-zoom-in"
               data-aos-easing="ease-in-out-cubic"
               data-aos-delay="2200"
               data-aos-duration="1500">
               <router-link class="btn btn-primary btn-lg mt-3"
                            :to="{ name: 'Marketplace' }"
                            >Launch the app
               </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Home",
  };
</script>

<style scoped>
  .home {
    height: 100%;
  }
</style>
