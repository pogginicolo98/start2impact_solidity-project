<template>
  <div class="home">
    <div class="container height-100">
      <div class="row align-items-center height-100">
        <div class="col text-center">
          <div data-aos="fade-zoom-in"
               data-aos-easing="ease-in-out-cubic"
               data-aos-delay="400"
               data-aos-duration="2700">
               <p class="font-fantasy fs-70px mb-0">Welcome to Echoes of the past</p>
          </div>
          <div data-aos="fade-zoom-in"
               data-aos-easing="ease-in-out-cubic"
               data-aos-delay="600"
               data-aos-duration="2800">
               <p class="font-fantasy fs-32px text-secondary">An NFT marketplace with no back-end</p>
          </div>
          <div data-aos="fade-zoom-in"
               data-aos-easing="ease-in-back"
               data-aos-delay="2300"
               data-aos-duration="800">
               <router-link class="btn btn-primary btn-lg mt-3"
                            :to="{ name: 'Marketplace' }"
                            >Launch app
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
