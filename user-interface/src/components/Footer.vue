<template>
  <div class="footerComponent">
    <nav class="navbar navbar-light fixed-bottom">
      <div class="container-fluid justify-content-center">
        <div class="row justify-content-around">
          <div class="col">
            <a class="fs-24px"
               href="https://github.com/pogginicolo98/start2impact_solidity-project"
               ><font-awesome-icon :icon="['fab', 'github']" />
            </a>
          </div>
          <div class="col">
            <a class="fs-24px"
               href="https://www.linkedin.com/in/nicol%C3%B2-poggi-481227157/"
               ><font-awesome-icon :icon="['fab', 'linkedin-in']" />
            </a>
          </div>
          <div class="col">
            <a class="fs-24px"
               href="https://talent.start2impact.it/profile/nicolo-poggi"
               ><font-awesome-icon :icon="['fas', 'rocket']" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    name: "FooterComponent",
  }
</script>

<style scoped>
  .navbar {
    border-top: 1px solid #C7B1A9 !important;
    background: transparent !important;
  }

  .btn-nav {
    border-radius: 1rem !important;
  }

  .fs-24px {
    font-size: 24px;
  }
</style>
