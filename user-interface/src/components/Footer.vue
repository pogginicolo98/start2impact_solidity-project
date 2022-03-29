<template>
  <div class="footer-component">
    <footer>
      <div class="container">
        <div class="row justify-content-around justify-content-lg-center">

          <!-- GitHub link -->
          <div class="col-3 col-lg-1 text-center">
            <a class="link-icon"
               href="https://github.com/pogginicolo98/start2impact_solidity-project"
               ><i class="fa-brands fa-github"></i>
            </a>
          </div>

          <!-- Linkedin link -->
          <div class="col-3 col-lg-1 text-center">
            <a class="link-icon"
               href="https://www.linkedin.com/in/nicol%C3%B2-poggi-481227157/"
               ><i class="fa-brands fa-linkedin-in"></i>
            </a>
          </div>

          <!-- Start2Impact link -->
          <div class="col-3 col-lg-1 text-center">
            <a class="link-icon"
               href="https://talent.start2impact.it/profile/nicolo-poggi"
               ><i class="fa-solid fa-rocket"></i>
            </a>
          </div>

        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    name: "FooterComponent",
  }
</script>

<style scoped>

  .footer-component {
    border-top: 1px solid hsla(0,0%,100%,.2);
    background: transparent;
    margin-top: auto;
    padding-top: 15px;
    padding-bottom: 10px;
  }

  .link-icon {
    font-size: 24px;
    color: #FFF;
    opacity: 0.6;
  }

  .link-icon:hover {
    color: #FFF;
    opacity: 1;
  }
</style>
